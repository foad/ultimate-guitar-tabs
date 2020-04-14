# Organise and search tabs from ultimate-guitar.org


Get base JSON:

```
var artist = undefined;


console.log(JSON.stringify([...document.querySelectorAll('.pZcWD')].map(item => {

    let artistElement = item.querySelector('._2KJtL._1ofov.kWOod');

    let titleElement = item.querySelector('._2KJtL._1mes3.kWOod');


    if (artistElement) {

        artist = artistElement.innerText;

    }


    if (!artist || !titleElement) return;


    return {

artist: artist,

title: titleElement.innerText,

link: titleElement.getAttribute('href'),

    };

}).filter(item => item)))
```
Replace classes in `querySelector`s as appropriate
