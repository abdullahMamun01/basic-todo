


//create todo item
 export function generateTodoItemUI (todo) {
    const { id, task, description,finishedDate } = todo;
    const todoContainer = document.getElementById("todo-items");
    const todoItem = document.createElement("div");
    todoItem.id = `todo-item-${id}`;
    todoItem.className =
      "w-[432px]  h-[85px] bg-[#3E1671] flex flex-col justify-center items-center border border-0 rounded-md my-2";
    todoItem.innerHTML = `
        <div class="w-[390px] h-[55px] flex items-center  ">
          <input class="mt-1 ml-2 h-[19px] complete" type="checkbox" name=""  id="${id}">
          <div class="w-[330px] overflow-hidden">
            <div class="flex w-[330px] h-[19px] " >
            <h2 class="  ps-2 ms-2 text-[#9E78CF] ${todo?.isMatch? 'text-green-700' : ''} inline-block">${task}</h2>
            <span class="text-[10px] ps-2 ms-2 text-[#9E78CF] inline-block mt-auto">${finishedDate}</span>
            
            </div>
            <p class="text-[#9E78CF] w-[80%] ps-2 ms-2 text-[12px] py-2"> 
              ${description}
            
            </p>
          
          </div>
          <div class="w-[68px] h-[30px] ml-auto flex justify-between ml-auto">
            <button class="mr-0 border-0 edit-btn text-[#9E78CF]"  id="${id}">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="ml-0 border-0 delete-btn text-[#9E78CF]" id="${id}">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      `;
    todoContainer.appendChild(todoItem);
  }



  //display todo list for complete
export function generateCompleteTodoItemUI(text, id) {
    const completeList = document.getElementById("complete-list");
    const div = document.createElement("div");
    div.className =
      "w-[432px] h-[75px] bg-[#15101C] border-0 rounded-md flex justify-center my-2 ";
    div.innerHTML = `
    <h2 class="text-[#78CFB0] my-auto w-full px-3  line-through">${text}</h2>
    <button class="mr-8 border-0 delete-btn text-[#9E78CF] " id="${id}" >
        <i class="fa-solid fa-trash"></i>
    </button>
    `;
    completeList.appendChild(div);
  }