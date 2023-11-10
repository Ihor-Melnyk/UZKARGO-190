function setPropertyRequired(attributeName, boolValue = true) {
  //обов"язкове
  var attributeProps = EdocsApi.getControlProperties(attributeName);
  attributeProps.required = boolValue;
  EdocsApi.setControlProperties(attributeProps);
}

function setPropertyHidden(attributeName, boolValue = true) {
  //приховане
  var attributeProps = EdocsApi.getControlProperties(attributeName);
  attributeProps.hidden = boolValue;
  EdocsApi.setControlProperties(attributeProps);
}

function setPropertyDisabled(attributeName, boolValue = true) {
  //недоступне
  var attributeProps = EdocsApi.getControlProperties(attributeName);
  attributeProps.disabled = boolValue;
  EdocsApi.setControlProperties(attributeProps);
}

//Скрипт 1. Зміна властивостей атрибутів полів карточки
function onTaskPickUpedDetermineResponsible() {
  setPropOnDetermineResponsibleTaskOrInformHeadTask();
}

function onTaskPickUpedInformHead() {
  setPropOnDetermineResponsibleTaskOrInformHeadTask();
}

function setPropOnDetermineResponsibleTaskOrInformHeadTask() {
  var CaseTaskDetermineResponsible = EdocsApi.getCaseTaskDataByCode(
    "DetermineResponsible" + EdocsApi.getAttributeValue("Sections").value
  );
  var CaseTaskInformHead = EdocsApi.getCaseTaskDataByCode(
    "InformHead" + EdocsApi.getAttributeValue("Sections").value
  );

  //етап DetermineResponsible взято в роботу, поточний користувач = виконавець завдання DetermineResponsible
  if (
    (CaseTaskDetermineResponsible.state == "assigned" &&
      CurrentUser.employeeId == CaseTaskDetermineResponsible.executorId) ||
    (CaseTaskDetermineResponsible.state == "inProgress" &&
      CurrentUser.employeeId == CaseTaskDetermineResponsible.executorId) ||
    (CaseTaskDetermineResponsible.state == "delegated" &&
      CurrentUser.employeeId == CaseTaskDetermineResponsible.executorId)
  ) {
    setPropertyRequired("ResponsibleEmployee");
    setPropertyHidden("ResponsibleEmployee", false);
    setPropertyDisabled("ResponsibleEmployee", false);
    setPropertyRequired("InformEmloyee", false);
    setPropertyHidden("InformEmloyee", false);
    setPropertyDisabled("InformEmloyee", false);
  } else if (
    //етап InformHead взято в роботу, поточний користувач = виконавець завдання InformHead
    (CaseTaskInformHead.state == "assigned" &&
      CurrentUser.employeeId == CaseTaskInformHead.executorId) ||
    (CaseTaskInformHead.state == "inProgress" &&
      CurrentUser.employeeId == CaseTaskInformHead.executorId) ||
    (CaseTaskInformHead.state == "delegated" &&
      CurrentUser.employeeId == CaseTaskInformHead.executorId)
  ) {
    setPropertyRequired("ResponsibleEmployee", false);
    setPropertyHidden("ResponsibleEmployee", false);
    setPropertyDisabled("ResponsibleEmployee", false);
    setPropertyRequired("InformEmloyee", false);
    setPropertyHidden("InformEmloyee", false);
    setPropertyDisabled("InformEmloyee", false);
  } else if (
    CaseTaskDetermineResponsible.state == "completed" ||
    CaseTaskInformHead.state == "completed"
  ) {
    setPropertyRequired("ResponsibleEmployee");
    setPropertyHidden("ResponsibleEmployee", false);
    setPropertyDisabled("ResponsibleEmployee");
    setPropertyRequired("InformEmloyee", false);
    setPropertyHidden("InformEmloyee", false);
    setPropertyDisabled("InformEmloyee");
  } else {
    setPropertyRequired("ResponsibleEmployee", false);
    setPropertyHidden("ResponsibleEmployee");
    setPropertyDisabled("ResponsibleEmployee", false);
    setPropertyRequired("InformEmloyee", false);
    setPropertyHidden("InformEmloyee");
    setPropertyDisabled("InformEmloyee", false);
  }
}

function onTaskExecuteDetermineResponsible(routeStage) {
  debugger;
  if (routeStage.executionResult == "executed") {
    if (!EdocsApi.getAttributeValue("ResponsibleEmployee").value)
      throw `Внесіть значення в поле "Доручення"`;
  }
}

function onCardInitialize() {
  debugger;
  setPropOnDetermineResponsibleTaskOrInformHeadTask();
}

//Скрипт 2. Визначення ролі за розрізом
function setSections() {
  debugger;
  var Branch = EdocsApi.getAttributeValue("Branch");
  if (Branch.value) {
    var Sections = EdocsApi.getAttributeValue("Sections");
    var BranchData = EdocsApi.getOrgUnitDataByUnitID(Branch.value);
    if (Sections.value != BranchData.unitName) {
      Sections.value = BranchData.unitName;
      EdocsApi.setAttributeValue(Sections);
    }
  }
}

function onChangeBranch() {
  setSections();
}

function onBeforeCardSave() {
  setSections();
}
