//장바구니(cart)페이지 구현 - 로컬 스토리지 활용
const ITEM_LIST_KEY = "itemList";
const cartBody = document.getElementById('cartBody');
//만약 falsy한 값이면 빈 배열 할당 (단축 평가를 이용한 코드 - 한번 연습해봄.)
const storageItems = JSON.parse(localStorage.getItem(ITEM_LIST_KEY)) || []; 

function deleteCartItem(e)
{
  //closest 적용해봄 ! //const removedItem = (e.currentTarget.parentNode).parentNode; 와 같이 접근 안해도 됨
  const removedItem = e.currentTarget.closest("tr"); //선택자를 통해, 해당 선택자를 가진 가장 가까운 조상 요소를 가져옴!
  
  //해당 노드의 id를 확인하여, 
  //로컬 스토리지에 저장된 객체 배열들의 요소들 중,
  //같은 id를 갖는 객체를 cart = false; 설정해주기.
  storageItems[removedItem.id -1].cart = false;
  storageItems[removedItem.id -1].userCart = false; //처음엔 이거 안해줬는데, 삭제 후 추가하니 자동 체크되는 상황 발생하여 수정함
  //그 후, 다시 로컬스토리지도 갱신
  localStorage.setItem(ITEM_LIST_KEY, JSON.stringify(storageItems));

  removedItem.remove(); //조부모 삭제
}

/* 로컬 스토리지에서 값을 가져와서, 체크 박스 체크 해주는 함수*/
function initChecked()
{
  const initstorageItems = JSON.parse(localStorage.getItem(ITEM_LIST_KEY));
  //로컬 스토리지 기록으로 체크 해줄 checkbox들 전부 가져옴
  const checkboxes = document.querySelectorAll("#cartBody input[type ='checkbox']") //cartbody에 있는 모든 checkbox 타입의 input을 배열로 가져옴
  checkboxes.forEach((box)=>{
    const trNode = box.closest("tr"); 
    if(initstorageItems[trNode.id -1].userCart === true) //userCart 즉, 체크여부
    {
      box.checked = true; //이건 그냥 check로만 만들어주는 것! (그래서 신경쓸 게 생각보다 없음)
    }
  });
}


function bindingChecked(e)
{
  const removedItem = (e.currentTarget.parentNode).parentNode;
  //체크 되어있는지 확인(boolean값임) - if,else문이 아닌 삼항 연산자로 표현
  e.currentTarget.checked ? 
  storageItems[removedItem.id -1].userCart = true : 
  storageItems[removedItem.id -1].userCart = false
  
  //로컬 스토리지에 갱신
  localStorage.setItem(ITEM_LIST_KEY, JSON.stringify(storageItems));
}

function paintCartObj(obj)
{
  if(obj.cart)
  {
    const tr = document.createElement("tr");
    tr.id = obj.id; //나중에 삭제, 구매 확정에 사용될 예정

    // 첫번째 열(체크버튼) 생성 후, tr안에 넣어두는 과정
    const td1 = document.createElement("td");
    const input = document.createElement("input");
    input.setAttribute("type", "checkbox");
    

    input.addEventListener("change", bindingChecked) //값이 변할경우 이벤트리스너(체크 여부 반영)
    td1.appendChild(input);
    tr.appendChild(td1);

    // 두번째 열 생성 (이미지)
    const td2 = document.createElement("td");
    const img = document.createElement("img");
    img.setAttribute("src", "../../" + obj.img);
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
    deleteBtn.addEventListener("click", deleteCartItem); //행을 삭제할 수 있도록 이벤트 핸들러 부착.
    td6.appendChild(deleteBtn);
    tr.appendChild(td6);


    cartBody.appendChild(tr);
  }
}

//이제 로컬스토리지에서 가져온 걸 순회하면서, 테이블에 작성할 예정
function deleteCartObj(){ //그 전에, 렌더링 전에 존재하는 걸 삭제하는 로직 필요(필수,중요)
  const cartBody = document.getElementById("cartBody");
  while(cartBody.firstChild){ 
    cartBody.removeChild(cartBody.firstChild);
  }
}

function renderCart() //deleteCartObj + (모든 상품 중에서, obj.cart === true인 상품만) paintCartObj 적용
{
  deleteCartObj();
  const savedItemList = localStorage.getItem(ITEM_LIST_KEY); 
  console.log(savedItemList);
  if(savedItemList !== null) //로컬 스토리지에서 가져온 게 비어있는게 아니라면
  {
    const parsedItemList = JSON.parse(savedItemList); //다시 js오브젝트로 변환
    parsedItemList.forEach(paintCartObj);
  }
}

renderCart();
initChecked(); //이거 위치도 중요함. 당연히 paint된 이후에 진행해야 함!

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
      storageItems[(box.parentElement.parentElement).id - 1].userCart = true; //됐다!!!!!!!!!!!!!!
    })

    localStorage.setItem(ITEM_LIST_KEY, JSON.stringify(storageItems));

  }
  else{ //체크 안되어 있으면(혹은 체크 해제했으면)
    //모든 체크 버튼들 체크 해제
    checkboxes.forEach((box)=>{
      box.checked = false;
      storageItems[(box.parentElement.parentElement).id - 1].userCart = false;
    })

    localStorage.setItem(ITEM_LIST_KEY, JSON.stringify(storageItems));

  }
}


//*************** 모달 구현 부분 ***************

//모달 열고 닫는 로직 구성
const allCheck = document.querySelector("#allCheck");
allCheck.addEventListener("change", allCheckFunc)

//buy버튼 누를 때 로직 구성
const buyBtn = document.getElementById("buyBtn");
buyBtn.addEventListener("click", (e)=> {
  const buyModalWrapper = document.getElementById("buyModalWrapper");
  buyModalWrapper.style.display = "flex"; /*이렇게 넣은 건 인라인스타일로 들어간다 */
});

//closeBuyModal 아이콘 누를 때 로직 구성
const closeBuyModal = document.getElementById("closeBuyModal");
closeBuyModal.addEventListener("click", ()=>{
  const buyModalWrapper = document.getElementById("buyModalWrapper");
  buyModalWrapper.style.display = "none"; 
});

function paintModalItem(obj)
{  
  const modalContent = document.querySelector("#modalContent");
  //0. 아이템 틀 연결
  const div = document.createElement("div") ;
  div.classList.add("rowFlexDiv");
  modalContent.appendChild(div);

  // 1. 이미지 연결
  const img = document.createElement("img");
  img.setAttribute("src", "../../" + obj.img);
  div.appendChild(img);

  // 2. 상품 카테고리 , 이름, 가격 설정 및 연결
  const p1 = document.createElement("p");
  p1.classList.add("cartItemP");
  p1.innerText = `카테고리 : ${obj.category}`;

  const p2 = document.createElement("p");
  p2.classList.add("cartItemP");
  p2.innerText = `상품명: ${obj.name}`;

  const p3 = document.createElement("p");
  //p3.classList.add("cartItemP");
  p3.setAttribute("id", "cartItemPrice");
  //toLocaleString(인자) 가 아니라 변환할 것.toLocaleString() 형식으로 사용해야한다
  //메서드를 사용하는거라서 사용법이 그런 듯. 사용법 주의하고 정신차리기!
  const localPrice = obj.price.toLocaleString(); 
  p3.innerText = `가격 : ${localPrice}`;
  
  div.appendChild(p1);
  div.appendChild(p2);
  div.appendChild(p3);
}

 //그리고 총 가격 계산
function deleteBuyList()
{
  const modalContent = document.querySelector("#modalContent");
  while(modalContent.firstChild){ //만약 모달콘텐츠 박스 안에 첫번째 자식이 존재하면
    (modalContent.firstChild).remove(); //다 없어질 때까지 차근 차근 요소 삭제
    //혹은 modalContent.removeChild(modalContent.firstChild); 을 통해서도 삭제가 가능하다.
  }
}

function renderBuyList() {
  //매번 클릭시마다 paint 되도록 수정 - 새로운 문제 : 계속 껐다 키면 계속 렌더링 됨
  //따라서 처음에 기존 렌더링 여부 확인 후, 렌더링 되어 있으면 삭제하는 로직 필요
  deleteBuyList(); //필수!

  const NowAllObjs= JSON.parse(localStorage.getItem(ITEM_LIST_KEY));

  const nowUserCart = NowAllObjs.filter(obj => (obj.userCart === true));
  nowUserCart.forEach(paintModalItem);

  /*
  //가격만 뽑아내어 새로운 배열 만듬
  let allPrice = 0;
  const priceArr = nowUserCart.map((obj) => obj.price);  
  for (let aPrice of priceArr) //배열의 모든 요소 순회 (length를 사용할 수도 있음)
  {
    allPrice += aPrice;
  }
  */
  let allPrice = nowUserCart.reduce((accPrice, cur) => accPrice + cur.price, 0) // init : 0, accPrice: 값이 누적될 곳, cur: 현재 돌고 있는 배열의 요소, cur.price: 그 요소의 가격값
  const totalPrice = document.getElementById("totalPrice");
  totalPrice.textContent = allPrice.toLocaleString();

}

buyBtn.addEventListener("click", renderBuyList);


//마지막! 결제하기 버튼을 클릭 시 alert 뜨고 장바구니에서 삭제하기
const payBtn = document.getElementById("payBtn");

const payFunc = (e) => {
  const  NowAllObjs= JSON.parse(localStorage.getItem(ITEM_LIST_KEY));
  const nowUserCart = NowAllObjs.filter((obj) => {
    return (obj.userCart === true);
  });

  for(i = 0; i < nowUserCart.length; i++)
  {
    //현재 구매 직전의 아이템들의 아이디를 인덱스 삼아 전체 객체 배열에서 접근하여, 
    //해당 객체의 userCart 값을 false로 돌린다.
    NowAllObjs[(nowUserCart[i].id - 1)].userCart = false;
    NowAllObjs[(nowUserCart[i].id - 1)].cart = false;
  }
  localStorage.setItem(ITEM_LIST_KEY, JSON.stringify(NowAllObjs)); //로컬 스토리지에 갱신
  renderCart();
  initChecked();

  //구매창 닫기
  const buyModalWrapper = document.getElementById("buyModalWrapper");
  buyModalWrapper.style.display = "none"; 
}

payBtn.addEventListener("click", ()=>{
  alert("주문 완료!");
})
payBtn.addEventListener("click", payFunc);