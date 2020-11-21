// ==UserScript==
// @name         YeeLight Meets Controller
// @namespace    http://tampermonkey.net/
// @version      1
// @description  try to take over the world!
// @author       Alice Fernandes
// @match        https://meet.google.com/**
// @grant        none
// ==/UserScript==

(function() {
    //TODO: Handle disconnects
    let selector = "[role='button'][data-is-muted]";
    let target = document.querySelector(selector);

    let mutationObserver = null;
    let writer = null;
    let port = null;
    let allowLoop = true;
    let streamWriter = null;
    let requesting = false;
    let lastValue = "";


    //Check if target is avaliable
    function waitForMeets() {
        target = document.querySelector(selector);

        if (target == null) {
            window.setTimeout(waitForMeets, 1000);
        } else {
            let event = new CustomEvent("targetAquired");
            document.dispatchEvent(event);
        }



        //Update when changing the page;
        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if(mutation.addedNodes.length > 0){
                    target = document.querySelector(selector);

                    if(mutationObserver != null){
                        mutationObserver.disconnect();
                        observeMutations();

                    }
                }
            });
        }
                                           );

        var config = {
            childList:true,
            attributes: true,
            attributeFilter: ['data-is-muted'],
        };

        observer.observe(document.querySelector("body"), config);
    }

    waitForMeets();

    function observeMutations(){
        let selector = "[role='button'][data-is-muted]";
        var target = document.querySelector(selector);


        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.attributeName == "data-is-muted" && requesting === false) {
                    //Compare the values
                    if(lastValue === target.dataset.isMuted){
                        return;
                    }

                    if(target.dataset.isMuted == "true"){
                        requesting = true;
                        fetch('https://localhost:3000/color/255000000', {method:"POST"}).finally(() => {
                            requesting = false;
                        })
                    }else{
                        requesting = true;
                        fetch('https://localhost:3000/ct/4780', {method:"POST"}).finally(() => {
                            requesting = false;
                        })
                    }
                    lastValue = target.dataset.isMuted;
                }
            });
        }
                                           );

        var config = {
            attributes: true,
            attributeFilter: ['data-is-muted'],
        };

        observer.observe(target, config);

        mutationObserver = observer;
    }

    document.addEventListener("targetAquired", function () {
        observeMutations();
    })



})();