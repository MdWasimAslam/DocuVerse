import React, { useState } from 'react';
import axios from 'axios';
import './Home.css'; // Import your CSS file
import gptLogo from "../assets/chatgpt.svg";
import addBtn from "../assets/add-30.png";
import messageIcon from "../assets/message.svg";
import HomeIcon from "../assets/home.svg"
import Saved from "../assets/bookmark.svg"
import UpgradeIcon from "../assets/rocket.svg"
import SendIcon from "../assets/send.svg"
import UserIcon from "../assets/user-icon.png"
import gptIcon from "../assets/chatgptLogo.svg"
import { Dropzone, FileMosaic } from "@files-ui/react";
import Button from '@mui/material/Button';
import UploadFile from '../Models/UploadFile';
import { CircularProgress, LinearProgress } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PdfSourceId from '../Models/PdfSourceId.js';
import ChatPdf from '../Models/ChatPdf';
import Skeleton from '@mui/material/Skeleton';


function Home () {
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = React.useState([]);
  const [isUploadLoader, setisUploadLoader] = useState(false)
  const [signedUrl, setsignedUrl] = useState("");
  const [sourceID, setsourceID] = useState(null);
  const [message, setmessage] = useState("");
  const [chat, setchat] = useState("");
  const [ChatMessage, setChatMessage] = useState("");
  const [isThinking, setIsThinking] = useState(false);





  const updateFiles = (incommingFiles) => {
    console.log("incomming files", incommingFiles);
    setFiles(incommingFiles);
    incommingFiles[0].file? setSelectedFile(incommingFiles[0].file) : setSelectedFile(null)
  };
  const removeFile = (id) => {
    setFiles(files.filter((x) => x.id !== id));
  };

  async function uploadPdf() {
    if(selectedFile === null) return toast.error("Please select a PDF file")
    try {
      setisUploadLoader(true)
      const url = await UploadFile(selectedFile);
      console.log(typeof(url), "<----- Upload successful");
      setsignedUrl(url)

      // Getting the source ID from the uploaded PDF
        const res = await PdfSourceId(url);
        console.log(res, "<----- Source ID successful");
        setsourceID(res)
      
      setisUploadLoader(false)
      removeFile(files[0].id)
      toast("Feel free to begin your conversation.")
    } catch (error) {
      console.error("Error uploading PDF:", error);
      setisUploadLoader(false)
    }
  }

const handleInput = (e) => {
  console.log(e.target.value)
  setmessage(e.target.value)
  setChatMessage(e.target.value)
}

const clearInput = () => {
  setmessage("")
}

const insertSuggestion = (Summarise) => {
  setmessage(Summarise)
  setChatMessage(Summarise)
}

 
const sendMessage = async () => {
  // console.log(message)
  if(message === "") return toast.error("Please enter a message")
  if(sourceID === null) return toast.error("Please upload a PDF file")
  setmessage("")
  setIsThinking(true)
  const res = await ChatPdf(ChatMessage,sourceID);
  setchat(res)
  clearInput()
  setIsThinking(false)

}
const handleEnterKeyPress = (e) => {
  if (e.key === "Enter") {
    sendMessage();
    e.preventDefault(); // Prevent the default Enter key behavior (e.g., adding a new line)
  }
};

const reloadPage = () => {
  window.location.reload();
}

  return (
   <div className='App'>
    <div className='sidebar'>
      <div className='upperSide'>
        <div className="upperSideTop">
          <img src={gptLogo} alt='Logo' className='logo' />
          <span className='brand'>DocuVerse</span>
          <button className="midBtn" onClick={()=>{reloadPage()}}>
            <img src={addBtn} alt="" className="addBtn" />
            New Chat
          </button>
          <div className="upperSideBottom">
 
            <Dropzone
      onChange={updateFiles}
      value={files}
      className='dropZone-container'
      maxFiles={1}

    >
      {files.map((file) => (
        <FileMosaic key={file.id} {...file} onDelete={removeFile} info />
      ))}
    </Dropzone>
    <div>
   {isUploadLoader?null:
    <Button
    variant='contained'
    color='primary'
    className='uploadBtn'
    onClick={() => uploadPdf()} // Call the function within the component
    
    style={{
      padding: "8px 30px",
      borderRadius: "0.4rem",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
      fontSize: "16px",
      background: "#2e7d32",
      marginTop:"2rem",
      marginLeft:"0.2rem",
      fontFamily: "Poppins, sans-serif",
      fontWeight: "300",
      opacity: isUploadLoader ? 0.5 : selectedFile === null ? 0.5 : 1,
      cursor: isUploadLoader || selectedFile === null ? "not-allowed" : "pointer",
    }}
  >
    Upload PDF
  </Button>}
    {isUploadLoader? <LinearProgress size={20} style={{marginLeft:"1rem",color:"white"}}/> : null}
    </div>
          </div>
        </div>

      </div>
      <div className='lowerSide'>
          <div className="listItem" onClick={()=>{insertSuggestion("Summarise This Pdf")}}><img src={UpgradeIcon} alt='' className='listItemImg'/>Summarise This PDF</div>
          <div className="listItem" onClick={()=>{insertSuggestion("What are the skills present in the pdf")}}><img src={UpgradeIcon} alt='' className='listItemImg'/>Get Skills From Resume</div>
      </div>
    </div>


    {/* Main Chat Section */}
    <div className='main'>
    {ChatMessage?
  <>
    <div className="chats">
        <div className="chat">
          <img className='chatImg' src={UserIcon} alt="" /> <p className="txt">{ChatMessage?ChatMessage:""}</p>
        </div>

        {ChatMessage? <div className="chat bot">
          <img className='chatImg' src={gptIcon} alt="" /> <p className="txt">{isThinking? <Skeleton variant="text" 
          sx={{ fontSize: '5rem',padding:"30px",width:"80rem" }} />:chat}</p>
        </div>:null}
      </div></>:null  
  }



      
      <div className="chatFooter">
        <div className="inp">
          <input type="text" placeholder='Send a message...' onChange={(e)=>{handleInput(e)}} value={message} onKeyPress={handleEnterKeyPress} /> 
          <button className="send"><img src={SendIcon} onClick={()=>{sendMessage()}} className='send' alt='Send'/></button>
        </div>
        <p>This application is intended for a personal project with no associated rights. <a style={{color: "#5A4BFF"}} href="https://wasimaslam.cloud/">Md Wasim Aslam</a> </p>
      </div>

    </div>
    <ToastContainer />
   </div>
  );
}

export default Home;
