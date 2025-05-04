// When hovering over the buttons, the original background color is restored.
let button = document.querySelectorAll(".btn");
button.forEach((E) => {
  let backgroundColor = getComputedStyle(E).backgroundColor;
  E.onmouseenter = () => {
    E.style.backgroundColor = backgroundColor;
  };
});

// start create product
let add = document.getElementById("submit");
let NAME = document.getElementById("Name");
let PRICE = document.getElementById("price");
let form = document.querySelector("form");
let imageBase64 = "";
document.querySelector(".add-product").addEventListener("click", () => {
  if (localStorage.getItem("isEditing") === "true") {
    localStorage.removeItem("editID");
    localStorage.removeItem("isEditing");
    document.getElementById("submit").textContent = "Add";
  }
});
add.addEventListener("click", (event) => {
  event.preventDefault();
  if (localStorage.getItem("isEditing") === "true") {
    saveEdit();
  } else {
    createproduct();
  }
});
function createproduct() {
  let name = document.getElementById("Name").value.trim();
  let Category = document.getElementById("Category").value.trim();
  let price = document.getElementById("price").value.trim();
  let Disscount = document.getElementById("Disscount").value.trim();
  let Quantity = document.getElementById("Quantity").value.trim();
  let Image_file = document.getElementById("image").files[0];
  if (name === "") {
    NAME.classList.add("is-invalid");
  }
  if (price === "") {
    PRICE.classList.add("is-invalid");
  }
  if (name !== "" && price !== "") {
    let id = window.localStorage.getItem("id") || 0;
    window.localStorage.setItem("id", ++id);
    let product = {
      ID: id,
      Name: name,
      category: Category,
      price: price,
      disscount: Disscount,
      quantity: Quantity,
      image_file: "",
    };
    if (Image_file) {
      const reader = new FileReader();
      reader.onload = function () {
        imageBase64 = reader.result;
        product.image_file = imageBase64;
        addToLocalStorage(product);
        addProductToPage(product);
      };
      reader.readAsDataURL(Image_file);
    } else {
      addToLocalStorage(product);
      addProductToPage(product);
    }
    closeform();
    clearForm();
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "The product has been added successfully",
      showConfirmButton: false,
      timer: 1400,
      customClass: {
        popup: "succes-alert",
      },
    });
  }
}
// start check if input(name & price) is empty
isvalid();
// end check if input(name & price) is empty

// end create product

// start Search
let Search = document.getElementById("Search");
let iconSearch = document.getElementById("iconsearch");

iconSearch.addEventListener("click", () => {
  let searchTerm = Search.value.trim().toLowerCase();
  if (searchTerm !== "") {
    let array = JSON.parse(window.localStorage.getItem("arrayOfObject")) || [];
    let filteredProducts = array.filter(
      (product) =>
        product.Name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
    loadFilteredProducts(filteredProducts);
  } else {
    loadpage();
  }
});

function loadFilteredProducts(products) {
  let tbody = document.querySelector("#table tbody");
  tbody.innerHTML = "";
  products.forEach((product) => {
    let tr = document.createElement("tr");
    const Product = Object.entries(product);
    Product.forEach(([key, cell]) => {
      if (key === "image_file") {
        let td_view = document.createElement("td");
        create_button(td_view, cell);
        tr.appendChild(td_view);
      } else if (key === "ID") {
        let tdnum = document.createElement("td");
        tdnum.textContent = cell;
        tr.appendChild(tdnum);
      } else {
        let td = document.createElement("td");
        td.textContent = cell;
        tr.appendChild(td);
      }
    });
    let actions = document.createElement("td");
    create_actions(actions, product);
    tr.appendChild(actions);
    tbody.appendChild(tr);
  });
}
// end Search

//start store data from form when load the page in local storage
let data_form =
  document.querySelectorAll(
    "#Name , #Category , #price, #Disscount ,#Quantity , #image"
  ) || [];
storeFromFormToLocalStorage();
//end store data from form when load the page in local storage

// start add product to page
function addProductToPage(product) {
  let tbody = document.querySelector("#table tbody");
  let tr = document.createElement("tr");
  const Product = Object.entries(product);
  Product.forEach(([key, cell]) => {
    if (key === "image_file") {
      let td_view = document.createElement("td");
      create_button(td_view, cell);
      tr.appendChild(td_view);
    } else if (key === "ID") {
      let tdnum = document.createElement("td");
      tdnum.textContent = cell;
      tr.appendChild(tdnum);
    } else {
      let td = document.createElement("td");
      td.textContent = cell;
      tr.appendChild(td);
    }
  });
  let actions = document.createElement("td");
  create_actions(actions, product);
  tr.appendChild(actions);
  tbody.appendChild(tr);
}
// end add product to page

// strts get item from local storage and add to table
window.addEventListener("DOMContentLoaded", () => {
  loadpage();
});
// end get item from local storage and add to table

// start store in local storage
let products;
function addToLocalStorage(product) {
  if (window.localStorage.getItem("arrayOfObject")) {
    products = JSON.parse(window.localStorage.getItem("arrayOfObject"));
  } else {
    products = [];
  }
  products.push(product);
  window.localStorage.setItem("arrayOfObject", JSON.stringify(products));
}
// end store in local storage

// start add actions
function create_actions(actions, product) {
  actions.classList.add("text-center");
  ["bi-pencil", "bi-archive"].forEach((iconclass, index) => {
    let icon = document.createElement("i");
    icon.classList.add("bi", iconclass);
    icon.style.cssText = "cursor: pointer ; color: #d4937b";
    if (index === 0) {
      icon.style.cssText =
        "margin-right: 10px ; color: #1c6574 ;cursor: pointer";
      icon.setAttribute("data-bs-toggle", "modal");
      icon.setAttribute("data-bs-target", "#staticBackdrop");
      icon.setAttribute("data-id", product.ID);
      icon.addEventListener("click", function () {
        let id = this.getAttribute("data-id");
        EditProduct(id);
      });
    } else {
      icon.addEventListener("click", function () {
        icon.setAttribute("data-id", product.ID);
        let id = this.getAttribute("data-id");
        deletethisproduct(id);
      });
    }
    actions.appendChild(icon);
  });
}
// end add actions
function deletethisproduct(id) {
  Swal.fire({
    title: "Are you sure?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      let arr = JSON.parse(window.localStorage.getItem("arrayOfObject")) || [];
      arr = arr.filter((product) => product.ID != id);
      window.localStorage.setItem("arrayOfObject", JSON.stringify(arr));
      loadpage();
      Swal.fire({
        title: "Deleted!",
        text: "Your product has been deleted.",
        icon: "success",
      });
      if (!JSON.parse(window.localStorage.getItem("arrayOfObject"))) {
        localStorage.clear();
      }
    }
  });
}

function EditProduct(Id) {
  document.getElementById("submit").textContent = "Save";
  localStorage.setItem("editID", Id);
  localStorage.setItem("isEditing", "true");
  let arr = JSON.parse(window.localStorage.getItem("arrayOfObject")) || [];
  let find_product = arr.find((product) => product.ID == Id);
  if (find_product) {
    data_form.forEach((input) => {
      switch (input.id) {
        case "Name":
          input.value = find_product.Name;
          break;
        case "price":
          input.value = find_product.price;
          break;
        case "Category":
          input.value = find_product.category;
          break;
        case "Disscount":
          input.value = find_product.disscount;
          break;
        case "Quantity":
          input.value = find_product.quantity;
          break;
        case "image":
          let savedImageBase64 = find_product.image_file;
          if (savedImageBase64) {
            fetch(savedImageBase64)
              .then((res) => res.blob())
              .then((blob) => {
                const file = new File([blob], "saved-image.jpeg", {
                  type: blob.type,
                });
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                input.files = dataTransfer.files;
              });
          }
          break;
      }
    });

    data_form.forEach((input) => {
      if (input.id === "image") {
        window.localStorage.setItem(input.id, find_product.image_file);
      } else {
        localStorage.setItem(input.id, input.value);
      }
    });
  }
}

function saveEdit() {
  Swal.fire({
    title: "Do you want to save the changes?",
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: "Save",
    denyButtonText: `Don't save`,
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      let sava_id = window.localStorage.getItem("editID");
      let arr = JSON.parse(window.localStorage.getItem("arrayOfObject"));
      let index = arr.findIndex((product) => product.ID == sava_id);
      let edit_Product = arr.find((product) => product.ID == sava_id);
      let Image_file = document.getElementById("image").files[0];
      edit_Product = {
        ID: sava_id,
        Name: document.getElementById("Name").value,
        category: document.getElementById("Category").value,
        price: document.getElementById("price").value,
        disscount: document.getElementById("Disscount").value,
        quantity: document.getElementById("Quantity").value,
        image_file: "",
      };
      if (Image_file) {
        const reader = new FileReader();
        reader.onload = function () {
          imageBase64 = reader.result;
          edit_Product.image_file = imageBase64;
          arr[index] = edit_Product;
          window.localStorage.setItem("arrayOfObject", JSON.stringify(arr));
          loadpage();
          closeform();
        };
        reader.readAsDataURL(Image_file);
      } else {
        arr[index] = edit_Product;
        window.localStorage.setItem("arrayOfObject", JSON.stringify(arr));
        loadpage();
        closeform();
        clearForm();
      }
      Swal.fire("Saved!", "", "success");
    } else if (result.isDenied) {
      Swal.fire("Changes are not saved", "", "info");
    }
  });
}

function loadpage() {
  let arr = JSON.parse(window.localStorage.getItem("arrayOfObject")) || [];
  let tbody = document.querySelector("#table tbody");
  tbody.innerHTML = "";
  arr.forEach((product) => {
    let tr = document.createElement("tr");
    const Product = Object.entries(product);
    Product.forEach(([key, cell]) => {
      if (key === "image_file") {
        let td_view = document.createElement("td");
        create_button(td_view, cell);
        tr.appendChild(td_view);
      } else if (key === "ID") {
        let tdnum = document.createElement("td");
        tdnum.textContent = cell;
        tr.appendChild(tdnum);
      } else {
        let td = document.createElement("td");
        td.textContent = cell;
        tr.appendChild(td);
      }
    });
    let actions = document.createElement("td");
    create_actions(actions, product);
    tr.appendChild(actions);
    tbody.appendChild(tr);
  });
  checkstateform();
}

// start create button to view image
function create_button(td_view, cell) {
  let button = document.createElement("button");
  button.setAttribute("data-bs-target", "#static");
  button.setAttribute("data-bs-toggle", "modal");
  button.classList.add("btn", "btn-primary", "border-0");
  button.textContent = "View";
  button.style.backgroundColor = "#3d3d3d";
  td_view.classList.add("text-center");
  td_view.appendChild(button);
  button.addEventListener("click", () => {
    addImageToView(cell);
  });
}
// end create button to view image

// start add Image to model
function addImageToView(imagemodel) {
  let viewPhoto = document.getElementById("viewPhoto");
  viewPhoto.src = imagemodel;
}
// end add Image to model

// start check state form
function checkstateform() {
  let modal = document.getElementById("staticBackdrop");
  let bootstrap_modal =
    bootstrap.Modal.getInstance(modal) || new bootstrap.Modal(modal);
  modal.addEventListener("shown.bs.modal", () => {
    window.localStorage.setItem("state", "show");
  });
  modal.addEventListener("hidden.bs.modal", () => {
    window.localStorage.setItem("state", "hide");
  });
  if (window.localStorage.getItem("state") === "show") {
    bootstrap_modal.show();
    if (localStorage.getItem("isEditing") === "true") {
      let id = localStorage.getItem("editID");
      if (id) {
        document.getElementById("submit").textContent = "Save";
        data_form.forEach((input) => {
          if (input.id === "image") {
            let savedImageBase64 = localStorage.getItem("image");
            if (savedImageBase64) {
              fetch(savedImageBase64)
                .then((res) => res.blob())
                .then((blob) => {
                  const file = new File([blob], "saved-image.jpeg", {
                    type: blob.type,
                  });
                  const dataTransfer = new DataTransfer();
                  dataTransfer.items.add(file);
                  document.getElementById("image").files = dataTransfer.files;
                });
            }
          } else {
            input.value = window.localStorage.getItem(input.id);
          }
        });
      }
    } else {
      data_form.forEach((input) => {
        if (input.id === "Disscount" || input.id === "Quantity") {
          input.value = window.localStorage.getItem(input.id) || "1";
        } else if (input.id === "Category") {
          input.value = window.localStorage.getItem(input.id) || "Electronics";
        } else if (input.id === "image") {
          let savedImageBase64 = localStorage.getItem("image");
          console.log(savedImageBase64);
          if (savedImageBase64) {
            fetch(savedImageBase64)
              .then((res) => res.blob())
              .then((blob) => {
                const file = new File([blob], "saved-image.jpeg", {
                  type: blob.type,
                });
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                document.getElementById("image").files = dataTransfer.files;
              });
          }
        } else {
          input.value = window.localStorage.getItem(input.id);
        }
      });
    }
  }
}
// end check state form

// when click on (X) clear all data from form
document.getElementById("Closeform").addEventListener("click", () => {
  Swal.fire({
    title: "Do you want to cancel the operation?",
    icon: "question",
    iconHtml: "؟",
    confirmButtonText: "YES",
    cancelButtonText: "NO",
    showCancelButton: true,
    showCloseButton: true,
    customClass: {
      popup: "discard",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      if (localStorage.getItem("isEditing") === "true") {
        localStorage.removeItem("editID");
        localStorage.removeItem("isEditing");
        document.getElementById("submit").textContent = "Add";
      }
      clearForm();
      closeform();
    } else if (result.isDismissed) {
      Swal.close();
    }
  });
});

// start clear form
function clearForm() {
  document.querySelectorAll("#Name ,#price").forEach((input) => {
    input.classList.remove("is-invalid");
  });
  document.getElementById("Name").value = "";
  document.getElementById("Category").value = "Electronics";
  document.getElementById("price").value = "";
  document.getElementById("Disscount").value = "1";
  document.getElementById("Quantity").value = "1";
  document.getElementById("image").value = "";
  data_form.forEach((input) => {
    if (input.id === "Category") {
      window.localStorage.setItem(input.id, "Electronics");
    } else if (input.id === "Disscount" || input.id === "Quantity") {
      window.localStorage.setItem(input.id, "1");
    } else {
      window.localStorage.setItem(input.id, "");
    }
  });
}
// end clear form

// start close form
function closeform() {
  let modal = document.getElementById("staticBackdrop");
  let bootstrap_modal = bootstrap.Modal.getInstance(modal);
  bootstrap_modal.hide();
}
// end close form

function isvalid() {
  NAME.addEventListener("input", () => {
    NAME.classList.remove("is-invalid");
  });
  PRICE.addEventListener("input", () => {
    PRICE.classList.remove("is-invalid");
  });
}

function storeFromFormToLocalStorage() {
  data_form.forEach((input) => {
    let event = input.tagName === "select" ? "change" : "input";
    input.addEventListener(event, () => {
      if (input.id === "image") {
        let file = input.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function () {
            imageBase64 = reader.result;
            window.localStorage.setItem(input.id, imageBase64);
          };
          reader.readAsDataURL(file);
        }
      } else {
        window.localStorage.setItem(input.id, input.value);
      }
    });
  });
}

// start delete all product
document.getElementById("Deleteall").addEventListener("click", () => {
  const arrayOfObject = window.localStorage.getItem("arrayOfObject");

  if (arrayOfObject && JSON.parse(arrayOfObject).length > 0) {
    // التحقق إذا كانت الاريه غير فارغة
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        loadpage();
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      }
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "The list is empty or something went wrong!",
    });
  }
});
// end delete all product
