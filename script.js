
const apiKey = 'AIzaSyAjj0h4sM-Tc6tesxKQswsyvHOfhJuqrlU';
const spreadsheetId = '1RqsCTN9Nng_x5N24isUISlDN7ARiLMmhA1f2UHPRH7w';
const range = 'Sheet1!A2:Z'; // Adjust the range according to your data location

    $(document).ready(function () {
        // Fetch data from Google Sheet using JavaScript
        $.ajax({
            url: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`,
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                const dataArray = data.values;
                if (dataArray.length > 0) {
                    // Generate cards and populate with data
                    const cardsContainer = $('#image-track');
                    dataArray.forEach(row => {
                        const [CodeName, RealName, Birthday, Discord, FB, IG, otherContract, ImageUrl] = row;
                        const card = `
                                        <img class="image" src="${ImageUrl}" draggable="false" />
                                    `;
                        cardsContainer.append(card);
                    });
                }
            },
            error: function (error) {
                console.error('Error fetching data:', error);
            }
        });
    });

const track = document.getElementById("image-track");

const handleOnDown = e => track.dataset.mouseDownAt = e.clientX;

const handleOnUp = () => {
  track.dataset.mouseDownAt = "0";  
  track.dataset.prevPercentage = track.dataset.percentage;
}

const handleOnMove = e => {
  if(track.dataset.mouseDownAt === "0") return;
  
  const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX,
        maxDelta = window.innerWidth / 2;
  
  const percentage = (mouseDelta / maxDelta) * -100,
        nextPercentageUnconstrained = parseFloat(track.dataset.prevPercentage) + percentage,
        nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);
  
  track.dataset.percentage = nextPercentage;
  
  track.animate({
    transform: `translate(${nextPercentage}%, -50%)`
  }, { duration: 1200, fill: "forwards" });
  
  for(const image of track.getElementsByClassName("image")) {
    image.animate({
      objectPosition: `${100 + nextPercentage}% center`
    }, { duration: 1200, fill: "forwards" });
  }
}

/* -- Had to add extra lines for touch events -- */

window.onmousedown = e => handleOnDown(e);

window.ontouchstart = e => handleOnDown(e.touches[0]);

window.onmouseup = e => handleOnUp(e);

window.ontouchend = e => handleOnUp(e.touches[0]);

window.onmousemove = e => handleOnMove(e);

window.ontouchmove = e => handleOnMove(e.touches[0]);