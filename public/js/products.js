
  $(document).ready(function(){
    getData();

  	$('#nav-icon').click(function(){
  		$(this).toggleClass('open');
    	$("#nav").toggleClass("showing");
  	});
    hideItems(); //ensure items are hidden on load
  });

//call server for products
function getData(){
  $.ajax({
          url: '/getProducts',
          type: 'get',
          success:function(data){
            console.log(data);
            //break down into variables
            var hG = data[0];
            var dice = data[1];

            //create a product display for each item
            for (var i = 0; i < hG.length; i++){
              var itemImageURL = hG[i].imageURL;
              var itemTitle = hG[i].title;
              var itemDesc = hG[i].desc;
              var itemPrice = hG[i].price;
              var container = document.getElementById('hGood-container');
              var item = document.createElement('div');
              item.className = 'item';
              var thumb = document.createElement('div');
              thumb.className = 'thumbnail';
              var img = document.createElement('img');
              img.src = itemImageURL;

              var title = document.createElement('h3');
              title.innerHTML = itemTitle;
              var desc = document.createElement('p');
              desc.innerHTML = itemDesc;
              desc.className = 'description';

              var addCart = document.createElement('div');
              addCart.className = 'clearfix';
              var price = document.createElement('div');
              price.className = 'price';
              price.innerHTML = itemPrice;
              var buyButton = document.createElement('a');
              buyButton.className = 'btn buyBtn';
              buyButton.role='button';
              buyButton.innerHTML = 'Add To Cart';
              addCart.appendChild(price);
              addCart.appendChild(buyButton);


              var captionContainer = document.createElement('div');
              captionContainer.className = 'caption';
              captionContainer.appendChild(title);
              captionContainer.appendChild(desc);
              captionContainer.appendChild(addCart);

              thumb.appendChild(img);
              thumb.appendChild(captionContainer);
              item.appendChild(thumb);
              container.appendChild(item);
            }
          }
        });
}



function handleMenuClick(event){
  switch(event){
    case 'hGoods':
      showHGoods();
      break;
    case 'dice':
      showDice();
      break;
    case 'custom':
      showCustom();
      break;
    default:
      hideItems();
  }
}

function showHGoods(){
  document.getElementById('dice').style.display = "none";
  document.getElementById('custom').style.display = "none";
  document.getElementById('hGoods').style.display = "block";
}

function showDice(){
  document.getElementById('hGoods').style.display = "none";
  document.getElementById('custom').style.display = "none";
  document.getElementById('dice').style.display = "block";
}

function showCustom(){
  document.getElementById('dice').style.display = "none";
  document.getElementById('hGoods').style.display = "none";
  document.getElementById('custom').style.display = "block";
}

function hideItems(){
  document.getElementById('dice').style.display = "none";
  document.getElementById('custom').style.display = "none";
  document.getElementById('hGoods').style.display = "none";
}
