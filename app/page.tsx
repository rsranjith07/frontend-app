"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState("");

  const uploadFile = async () => {
    if (!file) {
      setMsg("Please select a file");
      return;
    }

    const reader = new FileReader();

    reader.onload = async () => {
      const base64 = (reader.result as string).split(",")[1];

      const res = await fetch(process.env.NEXT_PUBLIC_UPLOAD_API as string, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fileBase64: base64,
          fileName: file.name,
          contentType: file.type
        })
      });

      const data = await res.json();
      setMsg(JSON.stringify(data));
    };

    reader.readAsDataURL(file);
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>File Upload to S3 using Lambda</h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        onClick={uploadFile}
        style={{
          marginLeft: "10px",
          padding: "8px 15px",
          cursor: "pointer"
        }}
      >
        Upload
      </button>

      <p style={{ marginTop: "20px" }}>{msg}</p>
    </div>
  );
}

