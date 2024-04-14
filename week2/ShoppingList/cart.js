const ITEM_LIST_KEY = "itemList";
//장바구니(cart)페이지 구현 - 로컬 스토리지 활용
const cartBody = document.getElementById('cartBody');

const storageItems = localStorage.getItem(ITEM_LIST_KEY);
const parsedItems = JSON.parse(storageItems);

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

function paintCart(obj)
{
  if(obj.cart === true)
  {
    const tr = document.createElement("tr");
    tr.id = obj.id; //나중에 딱 이 부분을 삭제하기 위해 필요함 - 없어도 되나?

    // 첫번째 열 생성 후, tr안에 넣어두는 과정
    const td1 = document.createElement("td");
    const input = document.createElement("input");
    input.setAttribute("type", "checkbox");
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
console.log("메롱");
if(savedItemList !== null) //로컬 스토리지에서 가져온 게 비어있는게 아니라면
{
  const parsedItemList = JSON.parse(savedItemList); //다시 js오브젝트로 변환
  parsedItemList.forEach(paintCart);
}