import { readFileSync } from "node:fs";
import path from "node:path";

const primaryColor = 'oklch(71.33% 0.112 194.94)'
const ratio = 1.5
const logo = `data:image/png;base64,${readFileSync(
  path.resolve("./src/images/logo.png"),
).toString("base64")}`

const descriptionFontSize = 1.6 * ratio
const logoSize = 146 * ratio
export default function OG({
  title = "AsyncTalk｜中文 Web 开发与 AI 播客",
  ep,
  sp
}: {
  title: string,
  ep?: number
  sp?: number
  heroImageURL?: string
}
) {
  const titleFontSize = (title.length > 30 ? 2 : title.length > 20 ? 2.4 : 3) * ratio

  return (
    <div
      style={{
        display: 'flex',
        width: "100%",
        height: "100%",
        backgroundColor: "black",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: 'center',
          width: "100%",
          height: "100%",
          padding: '0 1rem',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          alignItems: "center",
          position: "relative",
        }}
      >
        <img
          src={logo}
          width={logoSize * 1.7}
          height={logoSize * 1.7}
          style={{ flexShrink: 0, objectFit: "contain" }}
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h1
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: `${titleFontSize}rem`,
              textOverflow: "ellipsis",
              overflow: "hidden",
              fontWeight: "bold",
              maxWidth: "40rem",
              fontFamily: "LXGWWenKai",
              wordBreak: "break-word",
              // color: primaryColor,
              color: 'white',
              margin: '1rem 0'
            }}
          >
            {title}
          </h1>
          <p style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: `${descriptionFontSize}rem`, color: primaryColor }}>
              Async Talk (asynctalk.com)
            </span>
            {(ep !== undefined || sp !== undefined) && (
              <>
                <span style={{ margin: '0 0.5rem', fontSize: `${descriptionFontSize}rem`, color: primaryColor }}>
                  -
                </span>
                <span style={{ fontSize: `${descriptionFontSize}rem`, color: primaryColor }}>
                  {ep !== undefined ? 'Episode' : 'Special'} {ep ?? sp}
                </span>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
