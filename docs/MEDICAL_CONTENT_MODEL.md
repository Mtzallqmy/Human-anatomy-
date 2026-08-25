# Medical content model

The stable relationship remains:

```text
3D mesh or imaging annotation
→ anatomical structure ID
→ localized medical content
→ physiology, pathology, imaging, and references
```

Systems, structures, diseases, physiology topics, and imaging studies have separate translation records. Structure relations can cross system boundaries and use typed relations such as `part_of`, `adjacent_to`, `supplies`, `drains_into`, `innervates`, `connected_to`, `passes_through`, and `controls`.

Pathology visuals declare a strategy (`morph`, `material`, `model_variant`, `shader`, `animation`, or `annotation_only`) and an accuracy label (`anatomically_modeled`, `conceptual`, or `illustrative`). Missing visual states fall back to affected-structure highlighting and explanation.

Imaging annotations link directly to structure IDs using normalized geometry. Imaging and 3D therefore share selection without coupling either visual asset to the other.
