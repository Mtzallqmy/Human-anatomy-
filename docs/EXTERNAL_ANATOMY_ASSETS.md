# External high-detail anatomy assets

The production atlas can stream high-detail anatomical GLB bundles from the Vanatome 1.4.0 web export of Z-Anatomy.

## Source and license

- Source project: Z-Anatomy — https://github.com/Z-Anatomy/Models
- Web export / catalog: Vanatome — https://github.com/vixotic/Vanatome
- Asset release used by this application: 1.4.0
- Anatomical asset license: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License text: https://creativecommons.org/licenses/by-sa/4.0/
- Attribution: Z-Anatomy contributors; Gauthier Kervyn and Marcin Zielinski, with additional contributors and upstream sources documented by Z-Anatomy. Web optimization/export by Vanatome.

The application displays this attribution and license in the 3D viewer whenever a licensed GLB is selected.

## Runtime strategy

High-detail bundles are loaded lazily per organ system from the versioned `z-anatomy-1.4.0-*.glb` endpoints. The repository does not vendor the large binary files. This keeps Git history small and allows the atlas to load only the current body system.

If a high-detail asset cannot be loaded, `ModelLoader` automatically falls back to the project-owned Three.js procedural model. The full-body multi-layer experience intentionally keeps its procedural model because it provides local per-system layer visibility and opacity controls that are not represented by the external full-body bundle.

## Adaptation

External GLB object names and `extras.anatomyId` metadata are matched against the atlas' stable local anatomical identifiers, English names and Latin names. Matching objects receive a runtime `localStructureId`, allowing the existing selection, pathology and information-panel architecture to continue to operate without coupling medical content to upstream mesh names.

The external model is normalized to the viewer's coordinate scale at runtime. This is an application-side adaptation for display and interaction; it is not a claim of diagnostic or surgical accuracy.

## Educational-use statement

The 3D assets and all generated CT/MRI/X-ray/ultrasound/histology visuals in this project are educational. They are not diagnostic images and are not a substitute for professional clinical judgment.
