document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("searchInput");
    const cards = document.querySelectorAll(".card");
  
    input.addEventListener("keyup", function () {
      const query = input.value.toLowerCase();
  
      cards.forEach((card) => {
        const text = card.textContent.toLowerCase();
        if (text.includes(query)) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });