import React, { useState } from 'react';
import axios from 'axios';
import './Home.css'; // Import your CSS file

import { createClient } from '@supabase/supabase-js'

// Use a custom domain as the supabase URL

const supabaseUrl = 'https://fabwcdsfiwzytkrpuijy.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhYndjZHNmaXd6eXRrcnB1aWp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTcwNTM3MTIsImV4cCI6MjAxMjYyOTcxMn0._PqpB6HLSmiN65Wk_-ts-_z8Vn6R3DCvdBu_fS49ztg'





function Home () {
  const [selectedFile, setSelectedFile] = useState(null);
  const supabase = createClient(supabaseUrl, supabaseKey)

async function getBucketData() {
   
const { data, error } = await supabase
.storage
.from('DocuVerseBucket')
.download('admin/panda.jpg')
    if (error) {
        console.error(error);
    } else {
        console.log(data);
    }
}


async function listAllBucxkets() {
   
   
    const { data, error } = await supabase
  .storage
  .from('DocuVerseBucket')
  .list('admin', {
    limit: 100,
    offset: 0,
    sortBy: { column: 'name', order: 'asc' },
  })
        if (error) {
            console.error(error);
        } else {
            console.log(data);
        }
    }
    
    async function uploadFile() {
        function uuid(){
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
              var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
              return v.toString(16);
            });
        }
        
        try {
          const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from('DocuVerseBucket')
            .upload(`admin/${selectedFile.name}`, selectedFile, {
              cacheControl: '3600',
              upsert: false
            });
      
          if (uploadError) {
            console.error('File upload error:', uploadError);
            return;
          }
      
          console.log('File uploaded successfully:', uploadData);
      
          const { data: signedUrlData, error: signedUrlError } = await supabase
            .storage
            .from('DocuVerseBucket')
            .createSignedUrl(`admin/${selectedFile.name}`, 60);
      
          if (signedUrlError) {
            console.error('Signed URL creation error:', signedUrlError);
            return;
          }
      
          console.log('Signed URL:', signedUrlData);
        } catch (error) {
          console.error('An error occurred:', error);
        }
      }
      



getBucketData()
listAllBucxkets()

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const config = {
    headers: {
      'x-api-key': 'sec_L49nZlMWzTpREBR4PCARJ0Eil7gzlYcY',
      'Content-Type': 'application/json',
    },
    responseType: 'stream',
  };

  const handleUploadClick = () => {
    if (selectedFile) {
      console.log('Selected File:', selectedFile);
      const data = {
        url: 'https://uscode.house.gov/static/constitution.pdf',
      };

      axios
        .post('https://api.chatpdf.com/v1/sources/add-url', data, config)
        .then((response) => {
          console.log('Source ID:', response.data.sourceId);
        })
        .catch((error) => {
          console.log('Error:', error.message);
          console.log('Response:', error.response.data);
        });
    } else {
      alert('Please select a file before uploading.');
    }
  };

  const handleMessage = () => {
    const data = {
      stream: true,
      sourceId: 'src_mzuU4WWgYnwyQsvk9cNRt',
      messages: [
        {
          role: 'user',
          content: 'Who wrote the constitution?',
        },
      ],
    };

    axios
      .post('https://api.chatpdf.com/v1/chats/message', data, config)
      .then((response) => {
        const stream = response.data;
        if (!stream) {
          throw new Error('No data received');
        }
        stream.on('data', (chunk) => {
          const text = chunk.toString();
          console.log('Chunk:', text);
        });

        stream.on('end', () => {
          console.log('End of stream');
        });
      })
      .catch((error) => {
        console.error('Error:', error.message);
      });
  };

  return (
    <div className="container">
      <h1>Chat with PDF</h1>
      <label htmlFor="myfile">Select a file:</label>
      <input
        type="file"
        id="myfile"
        name="myfile"
        onChange={handleFileChange}
      />
      <button className="upload-button" onClick={()=>{uploadFile()}}>
        Upload File
      </button>
      <button className="message-button" onClick={handleMessage}>
        Message
      </button>
    </div>
  );
}

export default Home;
