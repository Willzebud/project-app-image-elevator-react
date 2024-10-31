"use client";

import { useState } from "react";
import { ImageGenerator } from "@/app/ImageGenerator";
import { renderPNG } from "./render-png";

export default function Home() {
  const [settings, setSettings] = useState({
    padding: 16,
    shadow: 16,
    radius: 16,
  });
  const [image, setImage] = useState();
  const [loading, setLoading] = useState("idle");

  const setSetting = (name, value) => {
    setSettings((curr) => ({
      ...curr,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    const file = files[0];

    if (file.type !== "image/png") {
      alert("We only accept PNG");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = function () {
      const img = new Image();

      img.onload = function () {
        setImage({
          width: img.width,
          height: img.height,
          src: img.src,
          file: file.name,
        });
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };
  const handleDownload = async (isCopy) => {
    setLoading(isCopy ? "copying" : "downloading");
    const { blob } = await renderPNG({
      image,
      settings,
    });
    const url = URL.createObjectURL(blob);

    if (isCopy) {
      await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": blob,
        }),
      ]);
    } else {
      const link = document.createElement("a");
      link.download = image.file.replace(".png", "-elevation.png");
      link.href = url;
      link.click();
    }
    setLoading("idle");
  };

  return (
    <main className="w-full flex justify-center max-w-4xl px-4 py-8 max-lg:flex-col m-auto gap-8 lg:gap-16 min-h-full text-black">
      <div className="flex-1 flex items-center justify-center">
        <div className="card max-w-lg flex-1 bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-tittle">Settings</h2>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Pick a file</span>
              </div>
              <input
                type="file"
                className="file-input file-input-primary file-input-bordered file-input-sm w-full max-w-xs"
                onChange={handleFileChange}
              />
              <div className="label"></div>
            </label>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Padding</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                className="range file-input-primary"
                step="5"
                value={settings.padding}
                onChange={(e) => {
                  setSetting("padding", Number(e.target.value));
                }}
              />
              <div className="label"></div>
            </label>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Shadow</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                className="range file-input-primary"
                step="5"
                value={settings.shadow}
                onChange={(e) => {
                  setSetting("shadow", Number(e.target.value));
                }}
              />
              <div className="label"></div>
            </label>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Radius</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                className="range file-input-primary"
                step="5"
                value={settings.radius}
                onChange={(e) => {
                  setSetting("radius", Number(e.target.value));
                }}
              />
              <div className="label"></div>
            </label>
          </div>
        </div>
      </div>
      <div className="flex-1 w-full max-w-md lg:max-w-none overflow-hidden gap-4 m-auto flex-col flex items-center justify-center">
        <div
          style={{ maxWidth: 400 }}
          className="w-fit h-fit border rounded-md"
        >
          <ImageGenerator image={image} settings={settings} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          className="btn btn-primary"
          disabled={loading !== "idle"}
          onClick={() => handleDownload(false)}
        >
          Download{" "}
          {loading === "downloading" ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : null}
        </button>
        <button
          className="btn"
          disabled={loading !== "idle"}
          onClick={() => handleDownload(true)}
        >
          Copy{" "}
          {loading === "copying" ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : null}
        </button>
      </div>
    </main>
  );
}
