import { HMSVirtualBackgroundTypes } from "@100mslive/hms-virtual-background";

interface VirtualBackground {
  background: string | HTMLImageElement | HTMLVideoElement;
  backgroundType: HMSVirtualBackgroundTypes;
}

export function getRandomVirtualBackground(): VirtualBackground {
  const backgroundList: VirtualBackground[] = [
    {
      background: HMSVirtualBackgroundTypes.BLUR,
      backgroundType: HMSVirtualBackgroundTypes.BLUR,
    },
  ];

  const images: VirtualBackground[] = [
    "https://www.100ms.live/images/vb-1.jpeg",
    "https://www.100ms.live/images/vb-2.jpg",
    "https://www.100ms.live/images/vb-3.png",
    "https://d2qi07yyjujoxr.cloudfront.net/webapp/vb/hms1.png",
    "https://d2qi07yyjujoxr.cloudfront.net/webapp/vb/hms2.png",
    "https://d2qi07yyjujoxr.cloudfront.net/webapp/vb/hms3.png",
    "https://d2qi07yyjujoxr.cloudfront.net/webapp/vb/hms4.png",
  ].map((url) => ({
    background: url,
    backgroundType: HMSVirtualBackgroundTypes.IMAGE,
  }));

  backgroundList.push(...images);

  /* 
   //TODO: update with a better quality gif.
  const gifList: VirtualBackground[] = [
    {
      background: "https://www.100ms.live/images/vb-1.gif",
      backgroundType: HMSVirtualBackgroundTypes.GIF,
    },
  ];
  backgroundList.push(...gifList); 
  */

  const videoList: VirtualBackground[] = [
    "https://www.100ms.live/images/video-1.mp4",
    "https://www.100ms.live/images/video-2.mp4",
    "https://www.100ms.live/images/video-5.mp4",
    "https://www.100ms.live/images/video-7.mp4",
    "https://www.100ms.live/images/video-8.mp4",
  ].map((url) => ({
    background: url,
    backgroundType: HMSVirtualBackgroundTypes.VIDEO,
  }));
  backgroundList.push(...videoList);

  const randomIdx = Math.floor(Math.random() * backgroundList.length);
  const virtualBackground = backgroundList[randomIdx];
  switch (virtualBackground.backgroundType) {
    case HMSVirtualBackgroundTypes.IMAGE:
      const img = document.createElement("img");
      img.alt = "VB";
      img.src = backgroundList[randomIdx].background as string;
      virtualBackground.background = img;
      return virtualBackground;
    case HMSVirtualBackgroundTypes.VIDEO:
      const videoEl = document.createElement("video");
      videoEl.src = backgroundList[randomIdx].background as string;
      virtualBackground.background = videoEl;
      return virtualBackground;
    default:
      return virtualBackground;
  }
}
