# Medical CMS

## Access

Open /admin/login. Existing staff sign in with Supabase Auth. A new collaborator can request an account; it starts as viewer / pending and cannot enter the CMS until an administrator assigns an active staff role.

To bootstrap the first administrator, create the account through the request form, then update that one verified profile from the Supabase SQL editor:

```sql
update public.profiles
set role = 'admin', status = 'active'
where id = (select id from auth.users where email = 'YOUR_EMAIL');
```

Do not add service-role credentials to the frontend.

## Roles

| Role     | Capability                                                                                             |
| -------- | ------------------------------------------------------------------------------------------------------ |
| Editor   | Create bilingual drafts, edit draft/rejected content, add references, upload assets, submit for review |
| Reviewer | Read submitted content, add a review decision and notes, approve or reject                             |
| Admin    | Manage profiles and all catalogs, publish approved content, archive/delete when required               |

## Content editing

Use the matching catalog for systems, structures, diseases, physiology, or references. IDs are stable contracts: do not rename an ID after it is linked to a URL or mesh. Enter original Arabic and English summaries and attach traceable references.

Structure drafts include system, parent, English/Arabic names, description, anatomy, physiology, location, and optional Latin name. Disease drafts include affected structures, etiology, pathogenesis, morphology, and functional effects. Additional relations and stages remain database records, not code.

## 3D assets

Open 3D Assets, select a licensed GLB/GLTF file, enter attribution and version information, then map every extracted mesh name to an anatomical ID. The file is stored in the private medical-models bucket. Use Preview in 3D before submission. Unknown meshes may render but cannot select medical content.

## Publishing

Editors submit drafts. Reviewers approve or reject with a recorded review. Administrators publish approved records. Public users cannot read drafts, even if they know an ID.

## Multi-system bulk import

The Structures page accepts validated CSV or JSON. Validation rejects duplicate IDs, unknown systems, missing bilingual fields, malformed stable IDs, and parents absent from the import batch. Valid records enter as drafts and still require review.

## Medical imaging

`/admin/imaging` creates bilingual studies and series, links anatomy, displays modality coverage and provenance gaps, and accepts staff-only PNG/JPEG/WebP batches. The browser decodes and re-encodes each file to WebP to remove EXIF metadata before upload. Each file is limited to 25 MB and each batch to 100 frames.

Staff must confirm educational-use rights and de-identification. Public patient uploads are intentionally unsupported. The point annotation editor stores normalized coordinates from 0 to 1; database checks reject malformed geometry and unknown anatomical links.
