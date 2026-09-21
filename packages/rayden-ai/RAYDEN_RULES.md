# Rayden agent guidance

Use Rayden UI's complete, free default flavor, Citrionus. This checkout's canonical catalog describes a specific UI release and AI schema. Verify the consumer's installed UI release before applying version-dependent guidance; do not assume that a local checkout has been published to npm.

## Discover before generating

1. Request `get_catalog` for flavor/version context and available capabilities.
2. Use `get_components` to discover families and exact `exportNames`/`importPath` values.
3. Request `get_component_guidance` or `get_component_props` for each real export you use, including subcomponents.
4. Validate structured usage with `validate_component_usage`. Read errors, warnings, and `notAssessed`; a result without errors does not certify an entire application.

The same information is available through `getCatalog`, `getComponentGuidance`, and `validateComponentUsage` from `@raydenui/ai`. `getManifest` is exported from `@raydenui/ai/manifests`.

## Imports and identity

- Use exact public exports. `Spinner` means Spinner; `Banner` means Banner.
- `ActivityFeed` names a family. Import `ActivityItem` and `ActivityContent` from `@raydenui/ui`.
- Import `RaydenChart` from `@raydenui/ui/chart`; charts have optional peer dependencies that must be available when used.
- Import motion primitives and `MotionProvider` from `@raydenui/ui/motion`. Consult `get_catalog` for actual presets, recipes, and supported primitive props.
- Do not import type-only names as runtime components. For example, `BreadcrumbItem` is a type, not a JSX component.
- Aliases are discovery aids, not public export names. Unknown or ambiguous names require an explicit alternative.
- Future flavors are not available merely because they appear in planning documents.

## Composition and accessibility

Follow the supplied component-specific composition guidance. Keep TableHead/TableCell inside TableRow and use compound parts in their documented context. Optional children should remain optional; recommended patterns are not universal runtime requirements.

Use supported props and enum values from the generated contract. Inherited HTML and ARIA attributes are legitimate where the component's public types allow them; data attributes may require checking that a component forwards them. Provide accessible names, preserve keyboard interaction and focus management, and verify the rendered interface.

Respect the operating system's reduced-motion preference. Tabs and Modal motion is opt-in. Motion personality does not override accessibility constraints. SharedLayout's pilot covers a persistent element; it does not provide cross-tree shared layout IDs or spring physics.

## Reference boundaries

Token data, recipes, examples, anatomy, and component types serve different purposes. Types establish props; they do not prove runtime defaults. Authored examples can be fragments requiring imports, state, callbacks, and dependencies. Validate them against the current prop contract and test the interactions you implement.

Use the UI stylesheet and preset according to project setup. AI token data and DTCG exports are reference material with a separate generation path; do not claim full CSS, dark-mode, or Figma parity solely because token references resolve.

Rayden MCP provides knowledge and validation. A compatible registry can distribute setup and blocks. External Figma tools perform Figma edits. Do not confuse these capabilities or invent hosted installation URLs.
