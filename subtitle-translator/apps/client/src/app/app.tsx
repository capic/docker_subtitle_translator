import { UploadDropzone, Options } from '@bytescale/upload-widget-react';
import { useMutation, useQuery } from 'react-query';

const uploadMkv = (files: File[]) => {
  fetch('http://localhost:3333/api', {method: 'POST', body: files})
}

export function App() {
  const upload = useMutation({mutationFn: uploadMkv, mutationKey: 'uploadMkv'})

  const options: Options = {maxFileCount: 10}
  
  return <UploadDropzone options={options}
                  onUpdate={({ uploadedFiles }) => {
                    console.log(uploadedFiles.map(x => x.fileUrl).join("\n"))
                  }}
                  width="600px"
                  height="375px" />
}

export default App;

