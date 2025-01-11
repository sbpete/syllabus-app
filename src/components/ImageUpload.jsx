"use client";

import React, { useState, useRef } from "react";
import axios from "axios";
import Image from "next/image";
import Switch from "react-switch";
import { FileUploader } from "react-drag-drop-files";
import { MdFileUpload } from "react-icons/md";
import { IoCloseCircle } from "react-icons/io5";
import { TailSpin } from "react-loader-spinner";
import Confetti from "react-confetti-boom";
import "@/styles/animations.css";

const fileTypes = ["JPG", "PNG", "PDF"];

const CustomSwitch = ({ label, checked, onChange }) => {
  return (
    <div className="flex items-center gap-4">
      <label htmlFor={label} className="text-lg">
        {label}:
      </label>
      <Switch
        checked={checked}
        onChange={onChange}
        checkedIcon={false}
        uncheckedIcon={false}
        width={40}
        height={24}
        handleDiameter={20}
        onColor="#08adff"
      />
    </div>
  );
};

const ImageUpload = () => {
  const [includeSubject, setIncludeSubject] = useState(false);
  const [subject, setSubject] = useState("");
  const [includeGrade, setIncludeGrade] = useState(true);
  const [includeStatus, setIncludeStatus] = useState(true);

  const [files, setFiles] = useState([]);
  const [fileURLs, setFileURLs] = useState([]);
  const [sheetUrl, setSheetUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [isExploding, setIsExploding] = useState(false);

  const downloadSheetFromText = async (text) => {
    // download the file
    const fileContent = text;
    const fileName = "syllabus.csv";
    const blob = new Blob([fileContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleChange = (files) => {
    if (loading) return;
    const updatedURLs = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setFileURLs((prevURLs) => [...prevURLs, ...updatedURLs]);
    setFiles((prevFiles) => [...prevFiles, ...files]);
  };

  // Handle form submission (sending file to the backend)
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (fileURLs.length === 0) {
      setError("Please upload a file.");
      return;
    }

    // get user info from session storage
    const user = JSON.parse(window.sessionStorage.getItem("user"));

    if (!user) {
      setError("Please sign in to upload a file.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("Uploading files:", files);

      // convert files to base64
      const files_array = await Promise.all(
        files.map((file) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
          }).then((result) => {
            return result.split(",")[1];
          });
        })
      );

      const response = await axios.post(
        // "http://localhost:4000/api/parse-image",
        "https://backend-sdpy.onrender.com/api/parse-image",
        {
          files: files_array,
          includeSubject,
          subject,
          includeGrade,
          includeStatus,
          email: user.email,
          name: user.name,
        }
      );

      if (response.data.success) {
        // get link to the file
        console.log("Sheet URL:", response.data.sheetUrl);
        setSheetUrl(response.data.sheetUrl);
        setIsExploding(true);
        setTimeout(() => setIsExploding(false), 3000);

        // reset form
        setFileURLs([]);
        setFiles([]);
        setError("");
      } else {
        setError(response.data.error);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start justify-center gap-6 w-full max-w-5xl">
      <div className="flex flex-col gap-2 w-full">
        <div
          className={`w-full h-[50vh] border bg-gray-200 p-4 text-black rounded-lg relative ${
            loading ? "animate-pulse" : ""
          }`}
        >
          {loading && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <TailSpin color="#08adff" height={100} width={100} />
            </div>
          )}
          <FileUploader
            handleChange={handleChange}
            types={fileTypes}
            multiple={true}
            disabled={true}
          >
            <div className="flex flex-wrap w-full h-full gap-4">
              {fileURLs.length > 0 ? (
                fileURLs.map((url, index) => (
                  <div className="relative p-2 border rounded-lg">
                    <Image
                      alt="uploaded file"
                      key={index}
                      src={url}
                      width={100}
                      height={100}
                      className="rounded-lg w-32 h-32 object-cover border shadow-md"
                    />
                    <div className="absolute top-0 right-0 bg-white w-4 h-4 m-2 rounded-full" />

                    <IoCloseCircle
                      onClick={() => {
                        setFileURLs(fileURLs.filter((_, i) => i !== index));
                        setFiles(files.filter((_, i) => i !== index));
                      }}
                      className="absolute top-0 right-0 text-red-500 cursor-pointer w-6 h-6"
                    />
                  </div>
                ))
              ) : (
                <div className="flex w-full flex-col items-center justify-center gap-2">
                  <MdFileUpload
                    size={64}
                    color="gray"
                    className="small-bounce"
                  />
                  <p className="text-lg text-gray-500">
                    Drag and drop syllabus screenshots here
                  </p>
                </div>
              )}
            </div>
          </FileUploader>
        </div>

        {fileURLs.length > 0 && (
          <div className="flex gap-4 mt-4 border p-4 rounded-lg flex-wrap">
            {fileURLs.map((url, index) => (
              <div key={index} className="flex gap-2">
                <p>{files[index].name}</p>
                <IoCloseCircle
                  onClick={() => {
                    setFileURLs(fileURLs.filter((_, i) => i !== index));
                    setFiles(files.filter((_, i) => i !== index));
                  }}
                  className="text-red-500 cursor-pointer w-6 h-6"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {fileURLs.length > 0 && (
        <div className="flex flex-col m-4 w-full items-center gap-4 -mb-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`bg-blue-500 hover:bg-blue-700 text-white font-extrabold py-2 px-20 rounded-full transition duration-300 text-lg ${
              loading ? "cursor-not-allowed animate-pulse" : "cursor-pointer"
            }`}
          >
            {loading ? "Loading..." : "Create Sheet"}
          </button>
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {sheetUrl && (
        <div className={`flex flex-col gap-2 w-full items-center`}>
          {isExploding && (
            <Confetti
              mode="boom"
              y={0.9}
              colors={["#38b6ff", "#ffde59"]}
              launchSpeed={0.7}
            />
          )}
          <h2 className="text-xl font-bold">Your sheet is ready!</h2>
          <a
            href={sheetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline hover:text-blue-700"
          >
            {sheetUrl}
          </a>
        </div>
      )}

      {fileURLs.length > 0 && (
        <div className="flex items-start gap-2 flex-col justify-between">
          <h2 className="text-xl">Options</h2>
          <div className="flex flex-col gap-2 border p-4 rounded-lg">
            <CustomSwitch
              label="📚 Include Subject"
              checked={includeSubject}
              onChange={(checked) => setIncludeSubject(checked)}
            />
            {includeSubject && (
              <input
                type="text"
                placeholder="Ex. MATH 1234"
                onChange={(e) => setSubject(e.target.value)}
                className="bg-gray-200 p-2 pt-3 rounded-lg"
              />
            )}

            <CustomSwitch
              label="📝 Include Grade"
              checked={includeGrade}
              onChange={(checked) => setIncludeGrade(checked)}
            />

            <CustomSwitch
              label="📊 Track Progress"
              checked={includeStatus}
              onChange={(checked) => setIncludeStatus(checked)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
