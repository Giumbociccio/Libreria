// import oggetto from "./file.json" with { type: "json" };

$(document).ready(function () {
  let pagina = $(location).attr("pathname").split("/");
  pagina = pagina[pagina.length - 1];

  let infoParams = new URLSearchParams($(location).attr("search"));
  if (pagina == "catalogo.html") {
    $.get("http://localhost:3000/books", function (data) {
      console.log(data)
      let catalogo = "<ul>"
      for (let libro of data) {
        catalogo += `<li>`
        for (let el in libro) {
          if(el == "isbn"){
            catalogo += `${libro[el]}<ul>`
            continue;
          }
          catalogo += `<li>${el}: ${libro[el]}</li>`
        }
        catalogo += `</ul></li>`
      }
      catalogo += `</ul>`
      $("#books").html(catalogo)
    })
  }

  // events

  $("form").on("submit", (e) => {
    e.preventDefault()
  })
  $("form").one("submit", () => {
    let libro = {};
    $("form").find("input").each(function () {
      let key = $(this).attr("name")
      let value = $(this).val()
      if (key != "undefined") {
        libro[key] = value;
      }
    })
    console.log("Libro: ", libro);

    $.ajax({
      url: "http://localhost:3000/book",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(libro),
      success: () => {
        $("#submit").text("Libro aggiunto correttamente");
      }
    })
  })
});
