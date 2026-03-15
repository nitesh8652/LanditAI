// Place in: src/Components/Ui/morph-loading.jsx

export default function Loader({ variant = "morph", size = "md", className = "" }) {

  const keyframes = `
    @keyframes shapeShift-sm {
      0%   { width:20px; height:20px; border-radius:3px;   transform:rotate(0deg)  scale(1);   background:#EC4E02; opacity:1; }
      10%  { width:40px; height:3px;  border-radius:2px;   transform:rotate(0deg)  scale(1);   background:#EC4E02; opacity:0.9; }
      22%  { width:20px; height:20px; border-radius:50%;   transform:rotate(0deg)  scale(1);   background:#f5f0e8; opacity:1; }
      34%  { width:2px;  height:32px; border-radius:2px;   transform:rotate(0deg)  scale(1);   background:#f5f0e8; opacity:0.7; }
      46%  { width:16px; height:16px; border-radius:3px;   transform:rotate(45deg) scale(1);   background:#EC4E02; opacity:1; }
      58%  { width:36px; height:10px; border-radius:999px; transform:rotate(0deg)  scale(1);   background:#EC4E02; opacity:0.85; }
      70%  { width:5px;  height:5px;  border-radius:50%;   transform:rotate(0deg)  scale(1);   background:#f5f0e8; opacity:0.6; }
      82%  { width:22px; height:22px; border-radius:5px;   transform:rotate(22deg) scale(0.9); background:#EC4E02; opacity:0.9; }
      100% { width:20px; height:20px; border-radius:3px;   transform:rotate(0deg)  scale(1);   background:#EC4E02; opacity:1; }
    }
    @keyframes shapeShift-md {
      0%   { width:40px; height:40px; border-radius:4px;   transform:rotate(0deg)  scale(1);   background:#EC4E02; opacity:1; }
      10%  { width:72px; height:4px;  border-radius:2px;   transform:rotate(0deg)  scale(1);   background:#EC4E02; opacity:0.9; }
      22%  { width:40px; height:40px; border-radius:50%;   transform:rotate(0deg)  scale(1);   background:#f5f0e8; opacity:1; }
      34%  { width:3px;  height:56px; border-radius:2px;   transform:rotate(0deg)  scale(1);   background:#f5f0e8; opacity:0.7; }
      46%  { width:32px; height:32px; border-radius:4px;   transform:rotate(45deg) scale(1);   background:#EC4E02; opacity:1; }
      58%  { width:64px; height:16px; border-radius:999px; transform:rotate(0deg)  scale(1);   background:#EC4E02; opacity:0.85; }
      70%  { width:8px;  height:8px;  border-radius:50%;   transform:rotate(0deg)  scale(1);   background:#f5f0e8; opacity:0.6; }
      82%  { width:44px; height:44px; border-radius:8px;   transform:rotate(22deg) scale(0.9); background:#EC4E02; opacity:0.9; }
      100% { width:40px; height:40px; border-radius:4px;   transform:rotate(0deg)  scale(1);   background:#EC4E02; opacity:1; }
    }
    @keyframes shapeShift-lg {
      0%   { width:56px;  height:56px;  border-radius:4px;   transform:rotate(0deg)  scale(1);   background:#EC4E02; opacity:1; }
      10%  { width:100px; height:6px;   border-radius:2px;   transform:rotate(0deg)  scale(1);   background:#EC4E02; opacity:0.9; }
      22%  { width:56px;  height:56px;  border-radius:50%;   transform:rotate(0deg)  scale(1);   background:#f5f0e8; opacity:1; }
      34%  { width:4px;   height:76px;  border-radius:2px;   transform:rotate(0deg)  scale(1);   background:#f5f0e8; opacity:0.7; }
      46%  { width:44px;  height:44px;  border-radius:4px;   transform:rotate(45deg) scale(1);   background:#EC4E02; opacity:1; }
      58%  { width:88px;  height:22px;  border-radius:999px; transform:rotate(0deg)  scale(1);   background:#EC4E02; opacity:0.85; }
      70%  { width:12px;  height:12px;  border-radius:50%;   transform:rotate(0deg)  scale(1);   background:#f5f0e8; opacity:0.6; }
      82%  { width:60px;  height:60px;  border-radius:8px;   transform:rotate(22deg) scale(0.9); background:#EC4E02; opacity:0.9; }
      100% { width:56px;  height:56px;  border-radius:4px;   transform:rotate(0deg)  scale(1);   background:#EC4E02; opacity:1; }
    }
  `;

  const shapeStyle = {
    animation: `shapeShift-${size} 4s cubic-bezier(0.76, 0, 0.24, 1) infinite`,
    ...(size === "sm" && { width: 20, height: 20 }),
    ...(size === "md" && { width: 40, height: 40 }),
    ...(size === "lg" && { width: 56, height: 56 }),
    background: "#EC4E02",
    borderRadius: 4,
  };

  const wrapSize = { sm: 60, md: 100, lg: 140 };

  if (variant === "morph") {
    return (
      <>
        <style>{keyframes}</style>
        <div
          className={className}
          style={{
            width: wrapSize[size],
            height: wrapSize[size],
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={shapeStyle} />
        </div>
      </>
    );
  }

  return null;
}
