async function ChatPdf(message, srcId) {
    try {
      console.log("Inside Message", message);
      const config = {
        method: "POST",
        headers: {
          "x-api-key": "sec_L49nZlMWzTpREBR4PCARJ0Eil7gzlYcY",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceId: srcId,
          messages: [
            {
              role: "user",
              content: message,
            },
          ],
        }),
      };
  
      const response = await fetch("https://api.chatpdf.com/v1/chats/message", config);
  
      if (response.ok) {
        const data = await response.json();
        console.log("Result:", data.content);
        return data.content;
      } else {
        throw new Error("Request failed with status: " + response.status);
      }
    } catch (error) {
      console.error("Error:", error.message);
      return error.message;
    }
  }
  
  export default ChatPdf;
  