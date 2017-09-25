let scrollPos = 0;
let currentTargetTime = 0;

function featureTest(property, value, noPrefixes) {
    var prop = property + ':',
        el = document.createElement('test'),
        mStyle = el.style;

    if (!noPrefixes) {
        mStyle.cssText = prop + ['-webkit-', '-moz-', '-ms-', '-o-', ''].join(value + ';' + prop) + value + ';';
    } else {
        mStyle.cssText = prop + value;
    }
    return mStyle[property];
}

const pTags = [].slice.apply(document.querySelectorAll(".interactive-seabed__text"));

const videoElContainer = document.querySelector(".interactive-seabed__container");

const videoElParent = videoElContainer.querySelector(".interactive-seabed__video");

const videoEl = videoElParent.querySelector("video");

const timings = [3.5, 8, 10];

const supportsSticky = featureTest('position', 'sticky') || featureTest('position', '-webkit-sticky');

if (!supportsSticky) {
    document.body.classList.add("no-sticky");
} else {
    document.body.classList.add("has-sticky");
}

//just caching some selectors incase the browser doesn't support position: sticky

const checkTags = () => {
    let passedPs = [];

    pTags.forEach((p, i) => {
        const bbox = p.getBoundingClientRect();

        if (bbox.top < 0) {
            passedPs.push(p);
        }
    });

    const timingToAimFor = timings[passedPs.length - 1];

    if (timingToAimFor > videoEl.currentTime) {
        currentTargetTime = timingToAimFor;
        videoEl.play();

        shouldPauseVideo(timingToAimFor);
    } else {
        //     if(currentTargetTime > timingToAimFor) {
        //         videoEl.pause();
        //         let timeToGoTo = (passedPs.length - 2 > 0) ? timings[passedPs.length] : 0;
        //         videoEl.currentTime = timeToGoTo;

        //         currentTargetTime = timingToAimFor;
        //     }
    }
}

const shouldPauseVideo = (timingToAimFor) => {
    if (timingToAimFor > videoEl.currentTime) {
        requestAnimationFrame(() => {
            shouldPauseVideo(timingToAimFor);
        });
    } else {
        videoEl.pause();
    }
}

const doScrollyThings = () => {
    if (window.pageYOffset !== scrollPos) {
        scrollPos = window.pageYOffset;

        checkTags();

        // if (!supportsSticky) {
        fixOrUnfix();
        // }
    }

    requestAnimationFrame(doScrollyThings);
}

const fixOrUnfix = () => {
    const containerBBox = videoElContainer.getBoundingClientRect();
    const containerTop = containerBBox.top;

    if(containerTop > 0) {
        currentTargetTime = 0;
        videoEl.currentTime = 0;
    }

    if (!supportsSticky) {
        if (containerBBox.bottom < window.innerHeight) {
            videoElParent.style.position = "";
            videoElParent.style.top = "auto";
            videoElParent.style.bottom = 0;
        } else if (videoElContainer.getBoundingClientRect().top <= 0) {
            videoElParent.style.top = "0";
            videoElParent.style.bottom = "auto";
            videoElParent.style.position = "fixed";
        } else {
            videoElParent.style.top = "0";
            videoElParent.style.bottom = "auto";
            videoElParent.style.position = "";
        }
    }
}

const switchSrc = () => {
    const width = videoEl.clientWidth;
    if (width > 620) {
        videoEl.setAttribute("src", process.env.PATH + "/assets/ships_1.mp4");
        videoEl.load();
    } else if (width > 600) {
        videoEl.setAttribute("src", process.env.PATH + "/assets/ships_2.mp4");
        videoEl.load();
    } else {
        videoEl.setAttribute("src", process.env.PATH + "/assets/ships_3.mp4");
        videoEl.load();
    }
}

switchSrc()
doScrollyThings();
