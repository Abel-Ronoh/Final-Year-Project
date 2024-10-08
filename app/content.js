// Inject the floating button
let button = document.createElement("button");
button.innerText = "Extract";
button.id = "pdf-extract-btn";
document.body.appendChild(button);

// Style the button to float on top of the page
button.style.position = "fixed";
button.style.top = "10px";
button.style.right = "10px";
button.style.zIndex = 9999;
button.style.padding = "10px 20px";
button.style.backgroundColor = "#4CAF50";
button.style.color = "white";
button.style.border = "none";
button.style.borderRadius = "5px";
button.style.cursor = "pointer";

// Load PDF.js library dynamically
let script = document.createElement("script");
script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.min.js";
document.body.appendChild(script);

// Wait for the library to load
script.onload = () => {
  console.log("PDF.js loaded");

  // Add click event to extract text when the button is clicked
  button.addEventListener("click", () => {
    extractTextFromPDF();
  });

  function extractTextFromPDF() {
    // Get the PDF viewer iframe (usually embedded in PDF viewers)
    const iframe = document.querySelector("embed[type='application/pdf']") || document.querySelector("iframe");

    if (!iframe) {
      alert("No PDF found on the page!");
      return;
    }

    // Fetch the PDF URL from the iframe src
    const pdfUrl = iframe.src;

    // Fetch the PDF and extract the text
    fetch(pdfUrl)
      .then(response => response.arrayBuffer())
      .then(data => {
        pdfjsLib.getDocument(new Uint8Array(data)).promise.then(pdf => {
          let extractedText = '';

          let promises = [];
          for (let i = 1; i <= pdf.numPages; i++) {
            promises.push(
              pdf.getPage(i).then(page => {
                return page.getTextContent().then(textContent => {
                  const pageText = textContent.items.map(item => item.str).join(' ');
                  extractedText += pageText + '\n\n';
                });
              })
            );
          }

          // Once all pages are processed, log the text to the console
          Promise.all(promises).then(() => {
            console.log("Extracted PDF Text: ", extractedText);
          });
        });
      })
      .catch(err => {
        console.error("Error extracting PDF text: ", err);
        alert("Failed to extract text from PDF.");
      });
  }
};
