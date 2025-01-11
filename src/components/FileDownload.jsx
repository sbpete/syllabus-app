"use client";

import React from "react";

const FileDownload = ({ text }) => {
  const handleDownload = () => {
    if (!text) {
      alert("No text to download.");
      return;
    }

    // Define file content
    const fileContent = text;
    const fileName = "example.txt";

    // Create a Blob with the content
    const blob = new Blob([fileContent], { type: "text/plain" });

    // Generate a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create an anchor element and trigger the download
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.style.display = "none"; // Hide the element
    document.body.appendChild(a); // Append to the DOM
    a.click(); // Simulate a click to start the download
    document.body.removeChild(a); // Clean up
    URL.revokeObjectURL(url); // Release the URL
  };

  return (
    <div style={{ marginTop: "1rem" }}>
      <button onClick={handleDownload}>Download File</button>
    </div>
  );
};

export default FileDownload;
