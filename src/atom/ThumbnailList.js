import React, { useState } from 'react';
import axios from 'api/axios';
import { AxiosPost } from 'toolbox/Fetch';
import OriginalFileView from './OriginalFileView';

export default function ThumbnailList({ imgDtoList }) {
    console.log("ThumbnailList render ", imgDtoList);

    const thumbnailRequestTarget = ["video", "image"];

    function renderImg(afdto, blob) {
        console.log("afdto", afdto);
        console.log("blob", blob);
        const thumbFile = new File([blob.data], "image");
        const imgUrl = (window.URL || window.webkitURL).createObjectURL(thumbFile);
        return <OriginalFileView imgUrl={imgUrl} afdto={afdto}/>
    }

    return <>
        {imgDtoList?.map(afdto => {
            if (thumbnailRequestTarget.includes(afdto.contentType)) {
                return <AxiosPost uri={`/anonymous/displayThumbnail`} body={afdto}
                    renderSuccess={renderImg} />
            } else if (afdto.contentType === "audio") {
                const imgUrl = process.env.PUBLIC_URL + "/images/audio.png";
                console.log("imgUrl", imgUrl);
                return <img src={imgUrl} />;
            } else {
                const imgUrl = process.env.PUBLIC_URL + "/images/unknown.png";
                console.log("imgUrl", imgUrl);
                return <img src={imgUrl} />;
            }
        })}
    </>

}
