const filter = document.getElementById("filter-data");

const tbody = document.querySelector("tbody");

const inputName = document.getElementById("name");
const inputBasicSal = document.getElementById("basic-salary");
const inputOT = document.getElementById("overtime");
const inputJob = document.getElementById("job");
const inputID = document.getElementById("id");

const totalSal = document.getElementById("total-salary");
const totalEmps = document.getElementById("total-employees");

const clearDiv = document.getElementById("clearDiv");
clearDiv.style.display = "none";

const errMsg = document.getElementById("errmsg");
const errMsg2 = document.getElementById("errmsg2");

const confirmUpdateMSg = document.getElementById("confirm-update");
confirmUpdateMSg.style.display = "none";

const addBtn = document.querySelector("#addBtn");
const updateBtn = document.querySelector("#updateBtn");

const clearBtn = document.querySelector("#clearBtn");

let employees = [];

let index = 0;

document.onkeyup = (event) => {
  if (event.key == "Escape") {
    clearDiv.style.display = "none";
    updateBtn.style.display = "none";
    confirmUpdateMSg.style.display = "none";

    addBtn.removeAttribute("disabled");
    addBtn.style.display = "block";

    clearInputs();
    enableInputs();
  }
};

function createObj() {
  const obj = {
    id: index++,
    ot: inputOT.value,
    hourly_rate: 52.5,
    basic: 420,
    salary: 0,
    name: inputName.value,
    job: inputJob.value,

    _getSalary: function () {
      return parseFloat(
        (this.salary = this.basic + this.ot * this.hourly_rate)
      ).toLocaleString(undefined, {
        style: "currency",
        currency: "PHP",
      });
    },

    _getBasic: function () {
      return this.basic.toLocaleString(undefined, {
        style: "currency",
        currency: "PHP",
      });
    },

    _setBasic: function (value) {
      return (this.basic = value);
    },

    _setOT: function (value) {
      return (this.ot = value);
    },
  };

  const same = employees.some(
    (obj) => obj.name.toLowerCase() == inputName.value.toLowerCase()
  );

  if (!same) {
    errMsg2.style.display = "none";
    employees.push(obj);
    showData(employees);
  } else {
    errMsg2.style.display = "block";
  }
}

if (employees.length >= 0 && employees.length <= 1) {
  clearBtn.setAttribute("disabled", true);
  disableInputFilter();
}

function showData(arr) {
  let data = arr
    .sort((a, b) => {
      return a.name < b.name ? -1 : 1;
    })
    .map((obj) => {
      return `
      <tr>
            <td>${obj.name.toUpperCase()}</td>
            <td>${obj._getBasic()}</td>
            <td>${obj._getSalary()}</td>
            <td>${obj.ot == "" ? (obj.ot = 0) : obj.ot} hr/s</td>
            <td>${obj.job.toUpperCase()}</td>
            <td>
              <button class="edit" onclick="edit(${obj.id})">EDIT</button>
              <button class="delete" onclick="del(${obj.id})">DELETE</button>
            </td>
      </tr>
      `;
    })
    .join("");

  tbody.innerHTML = data;

  totalEmps.textContent = `Total Employees: ${employees.length}`;

  getTotalSalary(arr);

  if (employees.length > 1) {
    clearBtn.removeAttribute("disabled");
    enableInputFilter();
  } else disableInputFilter();
}

addBtn.onclick = () => {
  if (inputName.value.toLowerCase() && inputJob.value.toLowerCase()) {
    errMsg.style.display = "none";

    createObj();

    inputName.focus();
    clearInputs();
    clearInputFilter();
  } else {
    inputName.focus();
    errMsg.style.display = "block";
  }
};

updateBtn.style.display = "none";
updateBtn.onclick = () => {
  if (inputName.value == "" || inputJob.value == "") {
    errMsg.style.display = "block";
  } else {
    errMsg.style.display = "none";
    enableInputFilter();

    updateBtn.style.display = "none";
    addBtn.style.display = "block";
    inputName.focus();

    const findID = employees.find((emp) => emp.id == inputID.value);

    findID.name = inputName.value;
    findID.job = inputJob.value;
    findID._setOT(inputOT.value);

    showData(employees);
    clearInputs();
    clearInputFilter();
  }
};

function edit(index) {
  disableInputFilter();

  inputName.focus();
  addBtn.style.display = "none";
  updateBtn.style.display = "block";

  errMsg2.style.display = "none";

  const idFinder = employees.find((emp) => emp.id == index);

  inputName.value = idFinder.name;
  inputOT.value = idFinder.ot;
  inputJob.value = idFinder.job;

  inputID.value = idFinder.id;
}

function del(index) {
  disableInputFilter();
  disableInputs();

  const findObj = employees.find((emp) => emp.id == index);

  addBtn.setAttribute("disabled", true);

  clearDiv.style.display = "none";
  errMsg.style.display = "none";
  errMsg2.style.display = "none";

  updateBtn.style.display = "none";
  addBtn.style.display = "block";

  confirmUpdateMSg.style.display = "block";
  confirmUpdateMSg.innerHTML = `
      <p>Are you sure to delete ${findObj.name.toUpperCase()}</p>
      <div>
        <button onclick="yes(${index})">YES</button>
        <button onclick="no()">NO</button>
      </div>
    `;
}

function yes(index) {
  enableInputs();
  addBtn.removeAttribute("disabled");
  confirmUpdateMSg.style.display = "none";
  employees = employees.filter(({ id }) => id !== index);

  showData(employees);
  getTotalSalary(employees);

  if (employees.length >= 0 && employees.length <= 1) {
    clearBtn.setAttribute("disabled", true);
    disableInputFilter();
  }

  clearInputs();
  clearInputFilter();
}
function no() {
  enableInputs();
  enableInputFilter();
  addBtn.removeAttribute("disabled");
  confirmUpdateMSg.style.display = "none";
}

clearBtn.onclick = () => {
  disableInputs();
  clearInputs();
  confirmUpdateMSg.style.display = "none";
  errMsg.style.display = "none";
  errMsg2.style.display = "none";

  addBtn.style.display = "block";
  addBtn.setAttribute("disabled", true);
  updateBtn.style.display = "none";

  clearDiv.style.display = "block";

  clearDiv.innerHTML = `
      <p>Are you sure to clear data?</p>
      <div>
        <button onclick=clearYesBtn()>YES</button>
        <button onclick=clearNoBtn()>NO</button>
      </div>
      `;
};

function clearInputs() {
  inputName.value = "";
  inputOT.value = "";
  inputJob.value = "";
  inputID.value = "";
}
function enableInputs() {
  inputName.removeAttribute("disabled");
  inputOT.removeAttribute("disabled");
  inputJob.removeAttribute("disabled");
}
function disableInputs() {
  inputName.setAttribute("disabled", true);
  inputOT.setAttribute("disabled", true);
  inputJob.setAttribute("disabled", true);
  inputID.setAttribute("disabled", true);
}

function enableInputFilter() {
  filter.removeAttribute("disabled");
}
function disableInputFilter() {
  filter.setAttribute("disabled", true);
}
function clearInputFilter() {
  filter.value = "";
}

function clearYesBtn() {
  addBtn.removeAttribute("disabled");
  clearBtn.setAttribute("disabled", true);
  clearDiv.style.display = "none";
  employees.length = 0;
  showData(employees);
  getTotalSalary(employees);
  clearInputs();
  clearInputFilter();
  disableInputFilter();
  enableInputs();
}

function clearNoBtn() {
  enableInputs();
  enableInputFilter();
  clearDiv.style.display = "none";

  addBtn.removeAttribute("disabled");
}

filter.oninput = () => {
  let data = employees.filter((obj) => {
    if (obj.name.toLowerCase().match(filter.value.toLowerCase())) {
      return obj.name;
    } else if (obj.job.toLowerCase().match(filter.value.toLowerCase())) {
      return obj.job;
    }
  });
  showData(data);
};

function getTotalSalary(arr) {
  let { salary } = arr.reduce(
    (currentTotal, currentObj) => {
      currentTotal.salary +=
        currentObj.basic + currentObj.ot * currentObj.hourly_rate;

      return currentTotal;
    },
    { salary: 0 }
  );

  totalSal.innerHTML = `
  TOTAL BUDGET: ${salary.toLocaleString(undefined, {
    style: "currency",
    currency: "PHP",
  })}`;
}
