import React, { useContext, useEffect, useState } from "react";
import Avatar from "react-avatar-edit";
export default function UploadAvatar({ setFile }) {
  const [src, setSrc] = useState(null);
  const [srcImage, setSrcImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const onClose = () => {
    setPreview(null);
  };

  const onCrop = (view) => {
    setPreview(view);
  };
  useEffect(() => {
    if (preview) {
      console.log(preview);
      fetch(preview)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "File name", {
            lastModified: new Date().getTime(),
            type: "image/png",
          });
          console.log(file);
          setFile(file);
        });
    }
  }, [preview]);

  // decode function

  return (
    <div>
      <Avatar
        width={400}
        height={400}
        onCrop={onCrop}
        onClose={onClose}
        src={src}
      />
      {/* {srcImage} */}
    </div>
  );
}
