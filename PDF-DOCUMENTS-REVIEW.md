# PDF & Documents Review v3

## Critical fix
The previous PDF tools had a real runtime bug: PDF Merge, Split, Rotate, Reorder, and Optimizer used `PDFLib` before loading the `pdf-lib` helper library. This caused those tools to fail even when internet access was available.

## Fixed
- PDF Merge now loads `pdf-lib` before processing.
- PDF Split now loads `pdf-lib` before processing.
- PDF Page Rotator now loads `pdf-lib` before processing.
- PDF Page Reorder now loads `pdf-lib` before processing.
- PDF Optimizer now gets its PDF library through the same safe loader.
- Clear error is shown if the helper library cannot be loaded.
- Images to PDF continues to load `jsPDF` through the external-resource manager.
- Text to PDF remains browser print based.

## Dependency status
The PDF helper libraries are still CDN-loaded in this version. They are **not yet fully offline**. The next dependency-hardening step should vendor the exact library files locally.
