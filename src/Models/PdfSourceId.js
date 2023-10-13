async function PdfSourceId(signedUrl) {
  console.log("Inside PdfSourceId", signedUrl);
  const config = {
    method: "POST",
    headers: {
      "x-api-key": "sec_L49nZlMWzTpREBR4PCARJ0Eil7gzlYcY",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: signedUrl,
    }),
  };

  try {
    const response = await fetch("https://api.chatpdf.com/v1/sources/add-url", config);

      console.log(response, "<----- Source ID response");
      const data = await response.json();
      console.log("Source ID:", data);
      return data.sourceId;
    
  } catch (error) {
    console.error("Error:", error.message);
  }
}

export default PdfSourceId;
