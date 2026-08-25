# Performance budget

## Loading

- Home and editorial routes do not import Three.js or imaging viewer code.
- A system switch requests one system bundle and one model asset.
- Full-body mode uses simplified geometry.
- GLB assets are cached by asset ID and version.
- Imaging prefetches only the current frame and two neighbors in each direction.
- Image binaries are not stored in TanStack Query cache.

## Rendering

- Low, medium, and high quality cap pixel ratio at 1, 1.4, and 2.
- Resize uses `ResizeObserver` and the render loop is owned by `SceneManager`.
- Models, materials, textures, labels, controls, and animation frames are disposed on teardown.
- Split view can reduce 3D quality through the existing quality control; heavy post-processing is intentionally absent.

## Asset targets

- Prefer system GLBs below 25 MB compressed for the first useful LOD.
- Use Draco or Meshopt for geometry and KTX2 for large textures.
- Avoid a single high-detail whole-body file.
- Keep draw calls and texture memory measurable in the asset review checklist.

The current generated educational visuals contain no large imaging binaries. Real licensed series must use thumbnails, nearby-frame prefetch, immutable versioned paths, and CDN caching.
