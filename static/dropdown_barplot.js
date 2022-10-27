function createDropDownMenu(title, variables, function_name, dropdown_ele_id)
{
    var drop_down_ele = document.getElementById(dropdown_ele_id);
    
    for(i in variables)
    {
        // console.log("Creating elements for dropdown : ",i);
        var ele = document.createElement("a");
        ele.innerHTML = variables[i];
        ele.className="dropdown-menu";
        ele.setAttribute("onClick",`${function_name}("${variables[i]}",${null})`)
        // ele.onclick = `${function_name}(${variables[i]})`;
        
        drop_down_ele.appendChild(ele);
        // console.log(drop_down_ele);
    }
    
//     <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
// Select a variable
// </button>
    
}

