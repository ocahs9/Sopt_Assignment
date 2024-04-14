const ITEM_LIST_KEY = "itemList";
//장바구니(cart)페이지 구현 - 로컬 스토리지 활용
const cartBody = document.getElementById('cartBody');

const storageItems = localStorage.getItem(ITEM_LIST_KEY);
const parsedItems = JSON.parse(storageItems); //localStorage에서 가져온 아이템

function deleteGrandParent(e)
{
  const grandParent = (e.currentTarget.parentNode).parentNode;
  //해당 노드의 id를 확인하여, 
  //로컬 스토리지에 저장된 객체 배열들의 요소들 중,
  //같은 id를 갖는 객체를 cart = false; 설정해주기.
  parsedItems[grandParent.id -1].cart = false;
  //그 후, 다시 로컬스토리지도 갱신
  localStorage.setItem(ITEM_LIST_KEY, JSON.stringify(parsedItems));

  grandParent.remove(); //조부모 삭제
}

/* 로컬 스토리지에서 값을 가져와서, 체크 박스 체크 해주는 함수*/
function initSelect()
{
  console.log("init실행");
  const initParsedItems = JSON.parse(localStorage.getItem(ITEM_LIST_KEY));
  //로컬 스토리지 기록으로 체크 해줄 checkbox들 전부 가져옴
  const checkboxes = document.querySelectorAll("#cartBody input[type ='checkbox']") //cartbody에 있는 모든 checkbox 타입의 input을 배열로 가져옴
  checkboxes.forEach((box)=>{
    const grandNode = box.parentElement.parentElement;
    if(initParsedItems[grandNode.id -1].userCart === true) //userCart 즉, 체크여부
    {
      box.checked = true; //이건 그냥 check로만 만들어주는 것! (그래서 신경쓸 게 생각보다 없음)
    }
  });
}





function selected(e)
{
  const grandParent = (e.currentTarget.parentNode).parentNode;
  if(e.currentTarget.checked) //체크 되어있는지 확인(boolean값임)
  {
    parsedItems[grandParent.id -1].userCart = true;
  }
  else{ //체크 안되어 있으면(혹은 체크 해제했으면)
    parsedItems[grandParent.id -1].userCart = false;
  }
  //로컬 스토리지에 갱신
  localStorage.setItem(ITEM_LIST_KEY, JSON.stringify(parsedItems));
}

function paintCart(obj)
{
  if(obj.cart === true)
  {
    const tr = document.createElement("tr");
    tr.id = obj.id; //나중에 삭제, 구매 확정에 사용될 예정

    // 첫번째 열(체크버튼) 생성 후, tr안에 넣어두는 과정
    const td1 = document.createElement("td");
    const input = document.createElement("input");
    input.setAttribute("type", "checkbox");
    

    input.addEventListener("change", selected) //값이 변할경우 이벤트리스너(체크 여부)
    td1.appendChild(input);
    tr.appendChild(td1);

    // 두번째 열 생성 (이미지)
    const td2 = document.createElement("td");
    const img = document.createElement("img");
    img.setAttribute("src", obj.img);
    td2.appendChild(img);
    tr.appendChild(td2);

    // 세번째 열 생성 (상품 이름)
    const td3 = document.createElement("td");
    td3.textContent = obj.name;
    tr.appendChild(td3);

    // 네번째 열 생성 (상품 금액)
    const td4 = document.createElement("td");
    td4.innerText = (obj.price).toLocaleString(); //3자리씩 끊어서 표현
    tr.appendChild(td4);

    // 다섯번째 열 생성 (카테고리)
    const td5 = document.createElement("td");
    td5.textContent = obj.category;
    tr.appendChild(td5);
    
    // 마지막 열 생성 (삭제 버튼)
    const td6 = document.createElement("td");
    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "삭제";
    deleteBtn.classList.add("deleteBtn"); //추후 클래스 적용을 위해
    deleteBtn.addEventListener("click", deleteGrandParent); //행을 삭제할 수 있도록 이벤트 핸들러 부착.
    td6.appendChild(deleteBtn);
    tr.appendChild(td6);


    cartBody.appendChild(tr);
  }
}


//이제 로컬스토리지에서 가져온 걸 순회하면서, 테이블에 작성할 예정
const savedItemList = localStorage.getItem(ITEM_LIST_KEY); 
console.log(savedItemList);
if(savedItemList !== null) //로컬 스토리지에서 가져온 게 비어있는게 아니라면
{
  const parsedItemList = JSON.parse(savedItemList); //다시 js오브젝트로 변환
  parsedItemList.forEach(paintCart);
}

initSelect(); //이거 위치도 중요함. 당연히 paint된 이후에 진행해야 함!

//allCheck버튼 누를 때, 다른 체크 박스들 전부 체크로 변경
const allCheckFunc = (e) => {
  const checkboxes = document.querySelectorAll("#cartBody input[type ='checkbox']") //cartbody에 있는 모든 checkbox 타입의 input을 배열로 가져옴
  console.log("올 체크 버튼 바뀜", checkboxes);
  console.log(e.currentTarget.checked);
  
  if(e.currentTarget.checked) //만약 allCheck버튼이 체크되었다면
  {
    //모든 체크 버튼들 체크로 변경
    checkboxes.forEach((box)=>{
      box.checked = true;
      // checked가 변경되는건, js 프로그래밍으로 속성을 변경하는 것이므로 사용자의 '이벤트'로 인식하지 못한다.
      // 따라서 원하는대로 input에 달린 change 이벤트 리스너가 호출되지 않는다.
      // 그래서, 결국 직접 조부모 노드를 찾아가서, 해당 노드의 id로 객체를 찾은다음
      // 해당 객체의 userCart를 직접 갱신해주는 로직을 추가해주어 해결했다!!
      parsedItems[(box.parentElement.parentElement).id - 1].userCart = true; //됐다!!!!!!!!!!!!!!
    })

    localStorage.setItem(ITEM_LIST_KEY, JSON.stringify(parsedItems));

  }
  else{ //체크 안되어 있으면(혹은 체크 해제했으면)
    //모든 체크 버튼들 체크 해제
    checkboxes.forEach((box)=>{
      box.checked = false;
      parsedItems[(box.parentElement.parentElement).id - 1].userCart = false;
    })

    localStorage.setItem(ITEM_LIST_KEY, JSON.stringify(parsedItems));

  }
}

const allCheck = document.querySelector("#allCheck");
allCheck.addEventListener("change", allCheckFunc)

//buy버튼 누를 때 로직 구성