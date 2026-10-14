var cl=console.log;
const Base_url="https://xhrcrud-default-rtdb.firebaseio.com"
const Todo_url=`${Base_url}/Mypet.json`

const addBtn=document.getElementById("addBtn");
const Petdata=document.getElementById("Petdata");
const form=document.getElementById("form");
const backdrop=document.getElementById("backdrop");
const name=document.getElementById("name");
const Type=document.getElementById("Type");
const Breed=document.getElementById("Breed");
const addButton=document.getElementById("addButton");
const updaButton=document.getElementById("updaButton");
const closeBtn=document.getElementById("closeBtn");
const spinner=document.getElementById("spinner");
const Photo=document.getElementById("Photo");

// localstorage
let state={
    PetArr:[],
    Edit_Id:null,
}

// Snakbar
function Snakbar(msg,icon){
    Swal.fire({
        title:msg,
        icon:icon,
        timer:2500,
    
    })
}

// spinner
function Handlespinner() {
    spinner.classList.toggle("d-none")
    
}





function onToggle(){
    backdrop.classList.toggle("active");
    form.classList.toggle("active");
    if(!form.classList.contains("active")){
        addButton.classList.remove("d-none");
        updaButton.classList.add("d-none");
        form.reset();
    }
}
//  templating
function templating(arr){
    let result=``;
    arr.forEach((ele,i)=> {
        result+=`<tr id=${ele.id}>
                            <td>${i+1}</td>
                            <td>${ele.name}</td>
                            <td>${ele.Type}</td>
                            <td>${ele.Breed}</td>
                            <td><img src="${ele.Photo}" alt="${ele.name}"></td>
                            
                                <td><button onclick= "Onedit(this)" class="btn btn-sm btn-primary">Edit</button></td>
                               <td> <button onclick= "OnRemove(this)" class="btn btn-sm btn-danger">Delete</button></td>
                            
                        </tr>
        `
        
    });
    Petdata.innerHTML=result;
}
// Read
async function OnShow() {
    Handlespinner();
    try {
        let res = await fetch(Todo_url,{
            method:"GET",
            body:null,
            headers:{
                  "content-Type":"application/json",
            "Authorization":"TOKEN JWT FROM  LS"
        
            }
        });
        let data = await res.json();

        state.PetArr = [];

        for (const key in data) {
            data[key].id = key;
            state.PetArr.push(data[key]);
        }

        templating(state.PetArr);

    } catch (err) {
        console.log(err);
    }finally{
        Handlespinner();
    }
}

OnShow();

// Craete
async function Oncraete(eve){
    Handlespinner();
    eve.preventDefault();
    try{
        const pet_url=`${Base_url}/Mypet.json`
        let obj={
            name:name.value,
            Type:Type.value,
            Breed:Breed.value,
            Photo:Photo.value
        }
        let res= await fetch(pet_url,{
            method:"POST",
            body:JSON.stringify(obj),
            headers:{
                "content-Type":"application/json",
            "Authorization":"TOKEN JWT FROM  LS"
        
            }
        })
        let data= await res.json()
                    obj.id = data.name;      
                    state.PetArr.unshift(obj);      
                    let tr=document.createElement("tr")
                    tr.id = data.name;

            tr.innerHTML=  `<td>${state.PetArr.length}</td>
                            <td>${obj.name}</td>
                            <td>${obj.Type}</td>
                            <td>${obj.Breed}</td>
                            <td><img src="${obj.Photo}" alt="${obj.name}"></td>
                            
                                <td><button onclick= "Onedit(this)" class="btn btn-sm btn-primary">Edit</button></td>
                               <td> <button onclick= "OnRemove(this)" class="btn btn-sm btn-danger">Delete</button></td>
                            
            ` 
            Petdata.prepend(tr)
            let td=[...document.querySelectorAll("#Petdata tr td:first-child")];
                             td.forEach((td,i) => {
                                td.innerHTML=i+1
                            });

            onToggle();
                Snakbar("New Data Created","success")

            form.reset();

        }catch(err){
            cl(err)

    }finally{
        Handlespinner();
    }

}

// edit
function Onedit(eve){
    let Edit_id=eve.closest("tr").id;
    state.Edit_Id=Edit_id
    let Edit_obj=state.PetArr.find(t=>t.id===Edit_id)
    name.value=Edit_obj.name;
    Photo.value=Edit_obj.Photo;
    Type.value=Edit_obj.Type;
    Breed.value=Edit_obj.Breed;
    addButton.classList.add("d-none")
    updaButton.classList.remove("d-none")
    onToggle();
}

async function Updatehandler(eve){
    Handlespinner();
    let updateId=state.Edit_Id
    try{
        let upobj={
             name:name.value,
            Type:Type.value,
            Breed:Breed.value,
            Photo:Photo.value,
            id:updateId
        
        }
        let update_url=`${Base_url}/Mypet/${updateId}.json`
        let res= await fetch(update_url,{
            method:"PATCH",
            body:JSON.stringify(upobj),
            headers:{
                "content-Type":"application/json",
                "Authorization":"TOKEN JWT FROM  LS"
        
            }
        })
        let data= await res.json();
        let index= state.PetArr.findIndex(t=>t.id===updateId)
        state.PetArr[index]=upobj
        let td=document.getElementById(updateId).children;
        td[1].innerText=data.name
        td[2].innerText=data.Type
        td[3].innerText=data.Breed
td[4].innerHTML = `<img src="${data.Photo}" alt="${data.name}">`;        
        onToggle()
        Snakbar("data updated","success")
        form.reset();
    }catch(err){
        cl(err)

    }finally{
        Handlespinner();
    }
}


// delete
async function OnRemove(params) {
    let Remove_id=params.closest("tr").id
    let result =await Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
});
  if (result.isConfirmed){
    Handlespinner();
    try{
        let Remove_url=`${Base_url}/Mypet/${Remove_id}.json`
        let res= await fetch(Remove_url,{
            method:"DELETE",
            headers:{
                "content-Type":"application/json",
            "Authorization":"TOKEN JWT FROM  LS"
        
            }
        })
        let data= await res.json();
        let index= state.PetArr.findIndex(t=>t.id===Remove_id)
        state.PetArr.splice(index,1)
        params.closest("tr").remove();
        templating(state.PetArr)
                Snakbar("Item Removed!","success")

    }catch (err){
        cl(err)

    }finally{
        Handlespinner();
    }
  }
    
}

form.addEventListener("submit",Oncraete)
addBtn.addEventListener("click", onToggle);
closeBtn.addEventListener("click", onToggle);
updaButton.addEventListener("click",Updatehandler);