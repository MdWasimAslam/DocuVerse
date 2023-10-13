import { createClient } from '@supabase/supabase-js';

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

async function uploadFile(incomingFile) {
  const supabaseUrl = 'https://fabwcdsfiwzytkrpuijy.supabase.co';
  const supabaseKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhYndjZHNmaXd6eXRrcnB1aWp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTcwNTM3MTIsImV4cCI6MjAxMjYyOTcxMn0._PqpB6HLSmiN65Wk_-ts-_z8Vn6R3DCvdBu_fS49ztg';

  const supabase = createClient(supabaseUrl, supabaseKey);
  const uniqueFileName = generateUUID() + '_' + incomingFile.name;

  try {
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('DocuVerseBucket')
      .upload(`admin/${uniqueFileName}`, incomingFile, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('File upload error:', uploadError);
      return null;
    }

    // console.log('File uploaded successfully:', uploadData);

    const { data: signedUrlData, error: signedUrlError } = await supabase
      .storage
      .from('DocuVerseBucket')
      .createSignedUrl(`admin/${uniqueFileName}`, 60000000000);

    if (signedUrlError) {
      console.error('Signed URL creation error:', signedUrlError);
      return null;
    }

    // console.log('Signed URL:', signedUrlData);
    return signedUrlData?.signedUrl;
  } catch (error) {
    console.error('An error occurred:', error);
    return null;
  }
}

export default uploadFile;
