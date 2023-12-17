import { useCallback } from 'react';
import Dropzone, { IDropzoneProps } from 'react-dropzone-uploader';


export function App() {
  const toast = (innerHTML) => {
    const el = document.getElementById('toast')
    el.innerHTML = innerHTML
    el.className = 'show'
    setTimeout(() => { el.className = el.className.replace('show', '') }, 3000)
  }

  const getUploadParams = () => {
    return { url: 'http://192.168.1.106:3333/api' }
  }

  const handleChangeStatus = ({ meta, remove }, status) => {
    if (status === 'headers_received') {
      toast(`${meta.name} uploaded!`)
      remove()
    } else if (status === 'aborted') {
      toast(`${meta.name}, upload failed...`)
    }
  }

  return (
    <>
      <div id="toast">Upload</div>
      <Dropzone
        accept=".mkv"
        getUploadParams={getUploadParams}
        onChangeStatus={handleChangeStatus}
        multiple={true}
        canCancel={true}
        inputContent="Drop A File"
        styles={{
          dropzone: { width: 400, height: 200 },
          dropzoneActive: { borderColor: 'green' },
        }}
        PreviewComponent={Preview}
      />
    </>
  )
}

export default App;

