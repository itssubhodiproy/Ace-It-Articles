

FilePond.registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageResize,
  FilePondPluginFileEncode,
  // // validates the size of the file
  FilePondPluginFileValidateSize,
  // // corrects mobile image orientation
  FilePondPluginImageExifOrientation,
  FilePondPluginFileValidateType
)

FilePond.setOptions({
  imagePreviewHeight: 100,
  imagePreviewWidth: 150,
  stylePanelAspectRatio: 3 / 10,
  // stylePanelLayout: 'compact circle',
  // imageResizeTargetWidth: coverWidth,
  // imageResizeTargetHeight: coverHeight,
  imageResizeTargetWidth: 150,
  imageResizeTargetHeight: 100
})

FilePond.parse(document.body)
