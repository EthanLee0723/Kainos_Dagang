"use client";

import { ExternalLink, ImagePlus, Plus, Star, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useId, useRef, useState, useTransition } from "react";
import { deleteProduct, discardPhotos, type ProductInput, saveProduct } from "@/lib/admin/actions/products";
import type { AdminDictionary } from "@/lib/admin/dictionaries/en";
import { type FieldErrors, fill, tr } from "@/lib/admin/format";
import { slugify } from "@/lib/admin/slug";
import type { Pictogram as PictogramKey } from "@/lib/products";
import type { Localized } from "@/lib/site";
import { ChipPicker, ConfirmDelete, PictogramPicker, SaveStatus } from "./controls";
import { emptyLocalized, errorFor, Field, fieldMessage, LocalizedField } from "./fields";
import { SortableList } from "./sortable";
import { adminButton, card, errorText, hint, input, sectionTitle } from "./ui";

export type ProductFormValues = {
  id?: string;
  slug: string;
  code: string;
  /** "" = no brand */
  brandId: string;
  categoryId: string;
  pictogram: PictogramKey;
  name: Localized;
  summary: Localized;
  description: Localized;
  pack: Localized;
  /** "" = no sizes */
  sizeChartId: string;
  sizes: string[];
  colourIds: string[];
  suitableForIds: string[];
  tagIds: string[];
  features: { key: string; text: Localized }[];
  /** `fresh`: uploaded in this visit and not saved yet. */
  photos: { key: string; url: string; fresh?: boolean }[];
  imageFit: "contain" | "cover";
  featured: boolean;
  visible: boolean;
};

export type ProductOptions = {
  categories: { id: string; name: string; pictogram: PictogramKey }[];
  brands: { id: string; name: string }[];
  sizeCharts: { id: string; name: string; values: string[] }[];
  colours: { id: string; label: string }[];
  suitableFor: { id: string; label: string }[];
  tags: { id: string; label: string }[];
  /** Feature lines used on other products, to reuse with their translations. */
  featureSuggestions: Localized[];
};

type Status = { tone: "ok" | "error"; text: string } | undefined;

let keySeed = 0;
const newKey = () => `k${Date.now().toString(36)}${(keySeed++).toString(36)}`;

/**
 * Shrink a photo to at most 2000px and re-encode it as WebP (JPEG where the
 * browser can't write WebP) before it is uploaded.
 */
async function shrink(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;
  const scale = Math.min(1, 2000 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const encode = (type: string) => new Promise<Blob | null>((done) => canvas.toBlob(done, type, 0.85));
  let blob = await encode("image/webp");
  if (blob?.type !== "image/webp") blob = await encode("image/jpeg");
  if (!blob) return file;
  const ext = blob.type === "image/webp" ? "webp" : "jpg";
  return new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.${ext}`, { type: blob.type });
}

function Section({ title, children, aside }: { title: string; children: ReactNode; aside?: ReactNode }) {
  return (
    <section className={`${card} p-5 sm:p-7`}>
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className={sectionTitle}>{title}</h2>
        {aside}
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

export function ProductForm({
  initial,
  options,
  t,
  justCreated,
}: {
  initial: ProductFormValues;
  options: ProductOptions;
  t: AdminDictionary;
  justCreated?: boolean;
}) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<FieldErrors>();
  const [status, setStatus] = useState<Status>(justCreated ? { tone: "ok", text: t.common.saved } : undefined);
  const [slugTouched, setSlugTouched] = useState(false);
  const [pictogramTouched, setPictogramTouched] = useState(!!initial.id);
  const [uploading, setUploading] = useState(0);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [pending, startTransition] = useTransition();
  const [deleting, startDelete] = useTransition();
  const fileInput = useRef<HTMLInputElement>(null);
  const suggestionsId = useId();
  const p = t.products;
  const isNew = !values.id;

  useEffect(() => {
    if (justCreated) window.history.replaceState(null, "", window.location.pathname);
  }, [justCreated]);

  const update = (patch: Partial<ProductFormValues>) => {
    setValues((v) => ({ ...v, ...patch }));
    setStatus(undefined);
  };

  const err = (path: string) => fieldMessage(t, errors, path);

  // --- photos
  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    const list = Array.from(files);
    setUploadErrors([]);
    setUploading((n) => n + list.length);
    for (const file of list) {
      try {
        const body = new FormData();
        body.append("file", await shrink(file));
        body.append("name", values.code || "photo");
        const res = await fetch("/api/admin/photos", { method: "POST", body });
        if (!res.ok) throw new Error(String(res.status));
        const { url } = (await res.json()) as { url: string };
        setValues((v) => ({ ...v, photos: [...v.photos, { key: url, url, fresh: true }] }));
        setStatus(undefined);
      } catch {
        setUploadErrors((names) => [...names, file.name]);
      } finally {
        setUploading((n) => n - 1);
      }
    }
    if (fileInput.current) fileInput.current.value = "";
  };

  const removePhoto = (key: string) => {
    const photo = values.photos.find((ph) => ph.key === key);
    update({ photos: values.photos.filter((ph) => ph.key !== key) });
    // An upload that was never saved isn't needed by anything else.
    if (photo?.fresh) void discardPhotos([photo.url]);
  };

  // --- features
  const suggestionByEn = new Map(options.featureSuggestions.map((s) => [s.en, s]));
  const setFeature = (key: string, text: Localized) => {
    const known = suggestionByEn.get(text.en);
    // Picking a known line brings its translations along, unless they were already typed.
    const next = known && !text.ms && !text.zh ? known : text;
    update({ features: values.features.map((f) => (f.key === key ? { ...f, text: next } : f)) });
  };

  // --- save / delete
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const pack = [values.pack.en, values.pack.ms, values.pack.zh].some((v) => v.trim()) ? values.pack : null;
    const input: ProductInput = {
      id: values.id,
      slug: isNew ? values.slug : undefined,
      code: values.code,
      brandId: values.brandId || null,
      categoryId: values.categoryId,
      pictogram: values.pictogram,
      name: values.name,
      summary: values.summary,
      description: values.description,
      pack,
      sizeChartId: values.sizeChartId || null,
      sizes: values.sizes,
      colourIds: values.colourIds,
      suitableForIds: values.suitableForIds,
      tagIds: values.tagIds,
      features: values.features.map((f) => f.text),
      photos: values.photos.map((ph) => ph.url),
      imageFit: values.imageFit,
      featured: values.featured,
      visible: values.visible,
    };
    startTransition(async () => {
      const result = await saveProduct(input);
      if (!result.ok) {
        setErrors(result.errors);
        setStatus({ tone: "error", text: result.message ? tr(t, result.message) : t.common.fixErrors });
        return;
      }
      setErrors(undefined);
      setValues((v) => ({ ...v, slug: result.data!.slug, photos: v.photos.map((ph) => ({ ...ph, fresh: false })) }));
      setStatus({ tone: "ok", text: t.common.saved });
      if (isNew) router.replace(`/admin/products/${result.data!.id}?saved=1`);
    });
  };

  const remove = () =>
    startDelete(async () => {
      const result = await deleteProduct(values.id!);
      if (result.ok) router.push("/admin/products");
      else setStatus({ tone: "error", text: t.common.error });
    });

  const chart = options.sizeCharts.find((c) => c.id === values.sizeChartId);
  const category = (id: string) => options.categories.find((c) => c.id === id);

  return (
    <form onSubmit={submit} noValidate className="max-w-4xl space-y-5 pb-28">
      <Section title={p.sections.basics}>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label={p.code} hint={p.codeHint} error={err("code")}>
            {(f) => (
              <input
                id={f.id}
                aria-describedby={f.describedBy}
                aria-invalid={f.invalid}
                value={values.code}
                onChange={(e) =>
                  update({ code: e.target.value, ...(isNew && !slugTouched ? { slug: slugify(e.target.value) } : {}) })
                }
                className={`${input} tabular`}
              />
            )}
          </Field>
          <Field label={p.slug} hint={p.slugHint} error={err("slug")}>
            {(f) =>
              isNew ? (
                <div className="flex items-center rounded-md border border-line bg-paper focus-within:border-ink">
                  <span className="pl-3 text-sm text-muted">/products/</span>
                  <input
                    id={f.id}
                    aria-describedby={f.describedBy}
                    aria-invalid={f.invalid}
                    value={values.slug}
                    onChange={(e) => {
                      setSlugTouched(true);
                      update({ slug: e.target.value.toLowerCase() });
                    }}
                    className="min-w-0 flex-1 bg-transparent py-2.5 pr-3 font-mono text-sm focus:outline-none"
                  />
                </div>
              ) : (
                <p id={f.id} className="py-2.5 font-mono text-sm">
                  /products/{values.slug}
                </p>
              )
            }
          </Field>
          <Field label={p.brand} error={err("brandId")}>
            {(f) => (
              <select id={f.id} aria-invalid={f.invalid} value={values.brandId} onChange={(e) => update({ brandId: e.target.value })} className={input}>
                <option value="">{p.noBrand}</option>
                {options.brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            )}
          </Field>
          <Field label={p.category} error={err("categoryId")}>
            {(f) => (
              <select
                id={f.id}
                aria-invalid={f.invalid}
                value={values.categoryId}
                onChange={(e) => {
                  const next = category(e.target.value);
                  update({ categoryId: e.target.value, ...(!pictogramTouched && next ? { pictogram: next.pictogram } : {}) });
                }}
                className={input}
              >
                {options.categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          </Field>
        </div>
        <PictogramPicker
          label={p.pictogram}
          value={values.pictogram}
          onChange={(pictogram) => {
            setPictogramTouched(true);
            update({ pictogram });
          }}
        />
      </Section>

      <Section title={p.sections.text}>
        <LocalizedField label={p.name} value={values.name} onChange={(name) => update({ name })} invalid={!!errorFor(errors, "name")} t={t} />
        <LocalizedField
          label={p.summary}
          hint={p.summaryHint}
          value={values.summary}
          onChange={(summary) => update({ summary })}
          invalid={!!errorFor(errors, "summary")}
          multiline
          rows={2}
          t={t}
        />
        <LocalizedField
          label={p.description}
          value={values.description}
          onChange={(description) => update({ description })}
          invalid={!!errorFor(errors, "description")}
          multiline
          rows={5}
          t={t}
        />
        <LocalizedField
          label={p.pack}
          hint={p.packHint}
          value={values.pack}
          onChange={(pack) => update({ pack })}
          invalid={!!errorFor(errors, "pack")}
          optional
          t={t}
        />
      </Section>

      <Section title={p.sections.photos}>
        <p className={hint}>{p.photosHint}</p>
        {values.photos.length > 0 && (
          <SortableList
            layout="grid"
            items={values.photos.map((ph) => ({ ...ph, id: ph.key }))}
            onReorder={(photos) => update({ photos })}
            labels={t.common}
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
            renderItem={(photo, index, { handle, arrows, isDragging }) => (
              <div className={`overflow-hidden rounded-lg border bg-paper ${index === 0 ? "border-ink" : "border-line"} ${isDragging ? "shadow-xl" : ""}`}>
                <div className="relative aspect-square bg-floor">
                  <Image src={photo.url} alt="" fill sizes="(min-width: 1024px) 14rem, 45vw" className="object-contain mix-blend-multiply p-2" />
                  {index === 0 && (
                    <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-sm bg-ink px-2 py-1 text-xs font-semibold text-paper">
                      <Star className="size-3" aria-hidden />
                      {p.mainPhoto}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removePhoto(photo.key)}
                    aria-label={`${p.removePhoto} ${index + 1}`}
                    className="absolute top-1 right-1 grid size-11 place-items-center rounded-full text-ink hover:text-[#c23a00]"
                  >
                    <span className="grid size-8 place-items-center rounded-full border border-line bg-paper shadow-sm">
                      <X className="size-4" aria-hidden />
                    </span>
                  </button>
                </div>
                <div className="flex items-center justify-between border-t border-line p-1">
                  {handle}
                  {arrows}
                </div>
              </div>
            )}
          />
        )}
        <div className="flex flex-wrap items-center gap-3">
          <input ref={fileInput} type="file" accept="image/*" multiple onChange={(e) => upload(e.target.files)} className="sr-only" id={`${suggestionsId}-files`} />
          <label htmlFor={`${suggestionsId}-files`} className={`${adminButton.secondary} cursor-pointer`}>
            <ImagePlus className="size-4" aria-hidden />
            {p.upload}
          </label>
          {uploading > 0 && (
            <span role="status" className="text-sm text-muted">
              {fill(p.uploading, { count: uploading })}
            </span>
          )}
        </div>
        {uploadErrors.map((name) => (
          <p key={name} className={errorText}>
            {fill(p.uploadFailed, { name })}
          </p>
        ))}
        {err("photos") && <p className={errorText}>{err("photos")}</p>}
        <label className="flex min-h-11 items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={values.imageFit === "cover"}
            onChange={(e) => update({ imageFit: e.target.checked ? "cover" : "contain" })}
            className="size-5 accent-ink"
          />
          {p.cover}
        </label>
        {isNew && values.photos.length > 0 && <p className={hint}>{p.saveFirst}</p>}
      </Section>

      <Section title={p.sections.sizes}>
        <Field label={p.sizeChart}>
          {(f) => (
            <select
              id={f.id}
              value={values.sizeChartId}
              onChange={(e) => update({ sizeChartId: e.target.value, sizes: [] })}
              className={`${input} max-w-sm`}
            >
              <option value="">{p.noSizes}</option>
              {options.sizeCharts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
        </Field>
        {chart && (
          <fieldset>
            <legend className="sr-only">{p.sections.sizes}</legend>
            <div className="mb-3 flex gap-2">
              <button type="button" onClick={() => update({ sizes: chart.values })} className={adminButton.quiet}>
                {p.selectAll}
              </button>
              <button type="button" onClick={() => update({ sizes: [] })} className={adminButton.quiet}>
                {p.selectNone}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {chart.values.map((size) => {
                const on = values.sizes.includes(size);
                return (
                  <label
                    key={size}
                    className="tabular inline-flex size-12 cursor-pointer items-center justify-center rounded-md border border-line bg-paper text-sm font-semibold has-checked:border-ink has-checked:bg-ink has-checked:text-paper has-focus-visible:outline-3 has-focus-visible:outline-orange"
                  >
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() =>
                        update({ sizes: on ? values.sizes.filter((v) => v !== size) : chart.values.filter((v) => v === size || values.sizes.includes(v)) })
                      }
                      className="sr-only"
                    />
                    {size}
                  </label>
                );
              })}
            </div>
          </fieldset>
        )}
      </Section>

      <Section title={p.sections.colours}>
        <ChipPicker
          legend={p.sections.colours}
          options={options.colours}
          selected={values.colourIds}
          onChange={(colourIds) => update({ colourIds })}
          empty={fill(p.noneDefined, { section: t.nav.colours })}
        />
      </Section>

      <Section title={p.sections.suitableFor}>
        <ChipPicker
          legend={p.sections.suitableFor}
          options={options.suitableFor}
          selected={values.suitableForIds}
          onChange={(suitableForIds) => update({ suitableForIds })}
          empty={fill(p.noneDefined, { section: t.nav.suitableFor })}
        />
      </Section>

      <Section title={p.sections.tags}>
        <ChipPicker
          legend={p.sections.tags}
          options={options.tags}
          selected={values.tagIds}
          onChange={(tagIds) => update({ tagIds })}
          empty={fill(p.noneDefined, { section: t.nav.tags })}
        />
      </Section>

      <Section title={p.sections.features}>
        <p className={hint}>{p.featuresHint}</p>
        <datalist id={suggestionsId}>
          {options.featureSuggestions.map((s) => (
            <option key={s.en} value={s.en} />
          ))}
        </datalist>
        {values.features.length > 0 && (
          <SortableList
            items={values.features.map((f) => ({ ...f, id: f.key }))}
            onReorder={(features) => update({ features })}
            labels={t.common}
            className="space-y-2"
            renderItem={(feature, index, { handle, arrows }) => {
              const invalid = !!errorFor(errors, `features.${index}`);
              return (
                <div className={`flex items-start gap-1 rounded-lg border bg-paper p-2 ${invalid ? "border-orange" : "border-line"}`}>
                  {handle}
                  <div className="grid min-w-0 flex-1 gap-2 md:grid-cols-3">
                    {(["en", "ms", "zh"] as const).map((lang) => (
                      <input
                        key={lang}
                        list={lang === "en" ? suggestionsId : undefined}
                        aria-label={`${p.features} ${index + 1} (${t.languages[lang]})`}
                        aria-invalid={invalid && !feature.text[lang].trim()}
                        lang={lang === "zh" ? "zh-Hans" : lang}
                        placeholder={t.languages[lang]}
                        value={feature.text[lang]}
                        onChange={(e) => setFeature(feature.key, { ...feature.text, [lang]: e.target.value })}
                        className={`${input} py-2`}
                      />
                    ))}
                  </div>
                  {arrows}
                  <button
                    type="button"
                    onClick={() => update({ features: values.features.filter((f) => f.key !== feature.key) })}
                    aria-label={`${p.removeFeature} ${index + 1}`}
                    className="grid size-11 shrink-0 place-items-center rounded-md text-muted hover:bg-[#c23a00]/10 hover:text-[#c23a00]"
                  >
                    <X className="size-4" aria-hidden />
                  </button>
                </div>
              );
            }}
          />
        )}
        <button
          type="button"
          onClick={() => update({ features: [...values.features, { key: newKey(), text: emptyLocalized() }] })}
          className={adminButton.secondary}
        >
          <Plus className="size-4" aria-hidden />
          {p.addFeature}
        </button>
      </Section>

      <Section title={p.sections.visibility}>
        <label className="flex min-h-11 items-center gap-3">
          <input type="checkbox" checked={values.visible} onChange={(e) => update({ visible: e.target.checked })} className="size-5 accent-ink" />
          {p.visible}
        </label>
        <label className="flex min-h-11 items-center gap-3">
          <input type="checkbox" checked={values.featured} onChange={(e) => update({ featured: e.target.checked })} className="size-5 accent-ink" />
          {p.featuredLabel}
        </label>
      </Section>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <button type="submit" disabled={pending || uploading > 0} className={adminButton.primary}>
            {pending ? t.common.saving : t.common.save}
          </button>
          <SaveStatus status={status} />
          <div className="ml-auto flex items-center gap-2">
            {!isNew && values.visible && (
              <a href={`/en/products/${values.slug}`} target="_blank" rel="noopener" className={adminButton.quiet}>
                {p.viewOnSite}
                <ExternalLink className="size-4" aria-hidden />
              </a>
            )}
            {!isNew && (
              <ConfirmDelete
                question={fill(p.deleteConfirm, { name: values.code })}
                labels={t.common}
                onConfirm={remove}
                pending={deleting}
              />
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
