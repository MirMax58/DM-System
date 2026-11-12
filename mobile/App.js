
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert, FlatList, KeyboardAvoidingView, Platform,
  ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { clearToken, getToken, gql, saveToken } from './src/api';
import Header from './src/components/Header';
import ProductForm from './src/components/ProductForm';
import ProductItem from './src/components/ProductItem';
import OrderItem from './src/components/OrderItem';

const USER = `id name email role isActive companyId companyName company { id name ownerName createdAt }`;
const PRODUCT = `id name sku category description price stock createdAt updatedAt`;
const ORDER = `id orderNumber customerName customerPhone total status createdAt createdBy createdByName stockReserved items { productId sku productName quantity unitPrice lineTotal }`;
const QUERIES = {
  me: `query { me { ${USER} } }`,
  products: `query { products { ${PRODUCT} } }`,
  orders: `query { orders { ${ORDER} } }`,
  users: `query { users { ${USER} } }`,
  company: `query { company { id name ownerId ownerName createdAt updatedAt } }`,
  invitations: `query { invitations { id expiresAt createdAt revokedAt usesCount isUsable } }`,
};
const money = (v) => `${Number(v || 0).toLocaleString('uk-UA', {minimumFractionDigits:2, maximumFractionDigits:2})} ₴`;
const date = (v) => v ? new Date(v).toLocaleDateString('uk-UA') : '—';
const statuses = { NEW:'Нове', PROCESSING:'В обробці', COMPLETED:'Виконане', CANCELLED:'Скасоване' };
const transitions = { NEW:['PROCESSING','CANCELLED'], PROCESSING:['COMPLETED','CANCELLED'], COMPLETED:[], CANCELLED:[] };
const categories = ['Електроніка','Аксесуари','Для дому','Одяг'];

export default function App() {
  const [user,setUser] = useState(null);
  const [company,setCompany] = useState(null);
  const [products,setProducts] = useState([]);
  const [orders,setOrders] = useState([]);
  const [users,setUsers] = useState([]);
  const [invitations,setInvitations] = useState([]);
  const [tab,setTab] = useState('overview');
  const [authMode,setAuthMode] = useState('login');
  const [busy,setBusy] = useState(false);
  const [refreshing,setRefreshing] = useState(false);
  const [feedback,setFeedback] = useState('');
  const [search,setSearch] = useState('');
  const [filter,setFilter] = useState('all');
  const [orderSearch,setOrderSearch] = useState('');
  const [orderFilter,setOrderFilter] = useState('all');
  const [auth,setAuth] = useState({name:'',email:'',password:'',companyName:'',invitationCode:''});
  const [editingProduct,setEditingProduct] = useState(null);
  const [productForm,setProductForm] = useState({name:'',sku:'',category:categories[0],price:'',stock:'',description:''});
  const [orderForm,setOrderForm] = useState({customerName:'',customerPhone:'',items:[{productId:'',quantity:'1'}]});
  const [inviteCode,setInviteCode] = useState('');
  const [companyName,setCompanyName] = useState('');

  const isAdmin = user?.role === 'ADMIN';

  async function loadData() {
    const [p,o,c] = await Promise.all([gql(QUERIES.products),gql(QUERIES.orders),gql(QUERIES.company)]);
    setProducts(p.products || []); setOrders(o.orders || []); setCompany(c.company || null);
    setCompanyName(c.company?.name || '');
    if (user?.role === 'ADMIN') {
      const [u,i] = await Promise.all([gql(QUERIES.users),gql(QUERIES.invitations)]);
      setUsers(u.users || []); setInvitations(i.invitations || []);
    } else { setUsers([]); setInvitations([]); }
  }
  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (token) {
          const data = await gql(QUERIES.me);
          if (data.me) { setUser(data.me); }
          else await clearToken();
        }
      } catch (e) { await clearToken(); }
      setBusy(false);
    })();
  }, []);
  useEffect(() => { if (user) loadData().catch(e => setFeedback(e.message)); }, [user]);

  async function refresh() {
    setRefreshing(true);
    try { await loadData(); setFeedback('Дані оновлено.'); }
    catch(e) { Alert.alert('Помилка',e.message); }
    finally { setRefreshing(false); }
  }
  async function run(task, success) {
    setBusy(true); setFeedback('');
    try { await task(); if (success) setFeedback(success); }
    catch(e) { Alert.alert('Помилка',e.message || 'Сталася помилка.'); }
    finally { setBusy(false); }
  }
  async function authenticate() {
    const email = auth.email.trim().toLowerCase();
    if (!email || !auth.password) return Alert.alert('Помилка','Введи email і пароль.');
    await run(async () => {
      let data;
      if (authMode === 'login') data = await gql(`mutation($email:String!,$password:String!){login(email:$email,password:$password){token user{${USER}}}}`,{email,password:auth.password});
      else if (authMode === 'register') {
        if (!auth.name.trim() || !auth.companyName.trim()) throw new Error('Заповни ім’я та назву компанії.');
        data = await gql(`mutation($input:RegisterCompanyInput!){registerCompany(input:$input){token user{${USER}}}}`,{input:{name:auth.name.trim(),email,password:auth.password,companyName:auth.companyName.trim()}});
      } else {
        if (!auth.name.trim() || !auth.invitationCode.trim()) throw new Error('Заповни ім’я та код запрошення.');
        data = await gql(`mutation($input:JoinCompanyInput!){joinCompany(input:$input){token user{${USER}}}}`,{input:{name:auth.name.trim(),email,password:auth.password,invitationCode:auth.invitationCode.trim()}});
      }
      const payload = data.login || data.registerCompany || data.joinCompany;
      await saveToken(payload.token); setUser(payload.user);
    });
  }
  async function logout() { await clearToken(); setUser(null); setProducts([]); setOrders([]); setTab('overview'); }

  function openProduct(product=null) {
    setEditingProduct(product);
    setProductForm(product ? {name:product.name,sku:product.sku,category:product.category,price:String(product.price),stock:String(product.stock),description:product.description || ''} : {name:'',sku:'',category:categories[0],price:'',stock:'',description:''});
  }
  async function saveProduct() {
    const input={name:productForm.name.trim(),sku:productForm.sku.trim().toUpperCase(),category:productForm.category,description:productForm.description.trim(),price:Number(productForm.price),stock:Number(productForm.stock)};
    if (!input.name || !input.sku || !input.category) return Alert.alert('Перевір дані','Заповни назву, артикул і категорію.');
    if (productForm.price==='' || !Number.isFinite(input.price) || input.price<0) return Alert.alert('Перевір дані','Ціна має бути невід’ємним числом.');
    if (productForm.stock==='' || !Number.isInteger(input.stock) || input.stock<0) return Alert.alert('Перевір дані','Залишок має бути цілим невід’ємним числом.');
    await run(async()=>{
      if(editingProduct) await gql(`mutation($id:ID!,$input:ProductInput!){updateProduct(id:$id,input:$input){id}}`,{id:editingProduct.id,input});
      else await gql(`mutation($input:ProductInput!){createProduct(input:$input){id}}`,{input});
      await loadData(); setEditingProduct(null);
    },editingProduct?'Товар оновлено.':'Товар додано.');
  }
  function deleteProduct(product) {
    Alert.alert('Видалити товар?',`«${product.name}» буде видалено з каталогу.`,[
      {text:'Скасувати',style:'cancel'},
      {text:'Видалити',style:'destructive',onPress:()=>run(async()=>{await gql(`mutation($id:ID!){deleteProduct(id:$id)}`,{id:product.id});await loadData();},'Товар видалено.')},
    ]);
  }
  function updateOrderRow(index,field,value) {
    setOrderForm(cur=>({...cur,items:cur.items.map((it,i)=>i===index?{...it,[field]:value}:it)}));
  }
  function addOrderRow() {
    const used=new Set(orderForm.items.map(x=>x.productId));
    const next=products.find(p=>p.stock>0&&!used.has(p.id));
    if(!next) return Alert.alert('Немає товарів','Немає інших товарів у наявності.');
    if(orderForm.items.length>=30) return Alert.alert('Обмеження','До 30 позицій у замовленні.');
    setOrderForm(cur=>({...cur,items:[...cur.items,{productId:next.id,quantity:'1'}]}));
  }
  const orderTotal=orderForm.items.reduce((sum,row)=>{const p=products.find(x=>x.id===row.productId);return sum+(p?p.price*Math.max(0,Number(row.quantity)||0):0)},0);
  async function createOrder() {
    if(!orderForm.customerName.trim()||!orderForm.customerPhone.trim()) return Alert.alert('Помилка','Вкажи ім’я та телефон клієнта.');
    if(!orderForm.items.length) return Alert.alert('Помилка','Додай товар до замовлення.');
    const items=[];
    for(const row of orderForm.items){
      const p=products.find(x=>x.id===row.productId), qty=Number(row.quantity);
      if(!p) return Alert.alert('Помилка','Обери товар у кожній позиції.');
      if(!Number.isInteger(qty)||qty<1) return Alert.alert('Помилка','Кількість має бути цілим числом від 1.');
      if(qty>p.stock) return Alert.alert('Помилка',`Недостатньо залишку: ${p.name}.`);
      items.push({productId:p.id,quantity:qty});
    }
    await run(async()=>{
      const result=await gql(`mutation($input:CreateOrderInput!){createOrder(input:$input){orderNumber}}`,{input:{customerName:orderForm.customerName.trim(),customerPhone:orderForm.customerPhone.trim(),items}});
      setOrderForm({customerName:'',customerPhone:'',items:[{productId:'',quantity:'1'}]});
      await loadData(); Alert.alert('Успіх',`Замовлення ${result.createOrder.orderNumber} створено.`);
    });
  }
  async function changeOrderStatus(order,next) {
    if(!transitions[order.status]?.includes(next)) return;
    await run(async()=>{await gql(`mutation($id:ID!,$status:OrderStatus!){updateOrderStatus(id:$id,status:$status){id}}`,{id:order.id,status:next});await loadData();},'Статус замовлення оновлено.');
  }
  function deleteOrder(order) {
    Alert.alert('Видалити замовлення?',order.orderNumber,[{text:'Скасувати',style:'cancel'},{text:'Видалити',style:'destructive',onPress:()=>run(async()=>{await gql(`mutation($id:ID!){deleteOrder(id:$id)}`,{id:order.id});await loadData();},'Замовлення видалено.')}]);
  }
  async function createInvite() {
    await run(async()=>{const d=await gql(`mutation($days:Int!){createInvitation(expiresInDays:$days){code invitation{id expiresAt}}}`,{days:7});setInviteCode(d.createInvitation.code);await loadData();},'Запрошення створено на 7 днів.');
  }
  async function updateUserStatus(member) {
    if(member.id===user.id && member.isActive) return Alert.alert('Заборонено','Не можна деактивувати власний обліковий запис.');
    Alert.alert('Підтвердження',`${member.isActive?'Деактивувати':'Активувати'} ${member.name}?`,[{text:'Скасувати',style:'cancel'},{text:'Підтвердити',onPress:()=>run(async()=>{await gql(`mutation($id:ID!,$active:Boolean!){updateUserStatus(id:$id,isActive:$active){id}}`,{id:member.id,active:!member.isActive});await loadData();},'Статус користувача змінено.')}]);
  }
  async function revokeInvite(inv) {
    Alert.alert('Відкликати код?','Користувачі більше не зможуть ним скористатися.',[{text:'Скасувати',style:'cancel'},{text:'Відкликати',style:'destructive',onPress:()=>run(async()=>{await gql(`mutation($id:ID!){revokeInvitation(id:$id){id}}`,{id:inv.id});await loadData();},'Запрошення відкликано.')}]);
  }
  async function saveCompany() {
    const name=companyName.trim(); if(name.length<2||name.length>100) return Alert.alert('Помилка','Назва має містити від 2 до 100 символів.');
    await run(async()=>{await gql(`mutation($name:String!){updateCompany(name:$name){id name}}`,{name});await loadData();},'Дані компанії оновлено.');
  }

  const visibleProducts=useMemo(()=>products.filter(p=>(filter==='all'||p.category===filter)&&[p.name,p.sku,p.description].some(v=>String(v||'').toLowerCase().includes(search.trim().toLowerCase()))),[products,filter,search]);
  const visibleOrders=useMemo(()=>orders.filter(o=>(isAdmin||o.createdBy===user?.id)&&(orderFilter==='all'||o.status===orderFilter)&&(!orderSearch.trim()||[o.orderNumber,o.customerName,o.customerPhone,...(o.items||[]).flatMap(i=>[i.productName,i.sku])].some(v=>String(v||'').toLowerCase().includes(orderSearch.trim().toLowerCase())))),[orders,isAdmin,user,orderFilter,orderSearch]);
  const myOrders=orders.filter(o=>isAdmin||o.createdBy===user?.id);
  const totalStock=products.reduce((a,p)=>a+Number(p.stock||0),0);
  const stockValue=products.reduce((a,p)=>a+Number(p.stock||0)*Number(p.price||0),0);

  if(!user) return (
    <SafeAreaView style={styles.safe}><StatusBar barStyle="dark-content" backgroundColor="#f4f6fb"/>
      <KeyboardAvoidingView style={styles.authWrap} behavior={Platform.OS==='ios'?'padding':undefined}>
        <ScrollView contentContainerStyle={styles.authContent} keyboardShouldPersistTaps="handled">
          <Text style={styles.brand}>DM-System</Text><Text style={styles.subtitle}>Управління товарами та замовленнями</Text>
          <View style={styles.card}>
            <Text style={styles.heading}>{authMode==='login'?'Вхід у систему':authMode==='register'?'Створити компанію':'Приєднатися до компанії'}</Text>
            {authMode!=='login'&&<Field label="Ім’я та прізвище" value={auth.name} onChangeText={v=>setAuth({...auth,name:v})} placeholder="Ваше ім’я"/>}
            <Field label="Email" value={auth.email} onChangeText={v=>setAuth({...auth,email:v})} placeholder="name@email.com" keyboardType="email-address" autoCapitalize="none"/>
            <Field label="Пароль" value={auth.password} onChangeText={v=>setAuth({...auth,password:v})} placeholder="Мінімум 8 символів" secureTextEntry/>
            {authMode==='register'&&<Field label="Назва компанії" value={auth.companyName} onChangeText={v=>setAuth({...auth,companyName:v})} placeholder="Назва компанії"/>}
            {authMode==='join'&&<Field label="Код запрошення" value={auth.invitationCode} onChangeText={v=>setAuth({...auth,invitationCode:v})} placeholder="Введіть код"/>}
            <Action title={busy?'Зачекай…':authMode==='login'?'Увійти':'Продовжити'} onPress={authenticate} disabled={busy}/>
            <Action title="Створити власну компанію" kind="link" onPress={()=>setAuthMode('register')}/>
            <Action title="Приєднатися за кодом запрошення" kind="link" onPress={()=>setAuthMode('join')}/>
            {authMode!=='login'&&<Action title="Повернутися до входу" kind="link" onPress={()=>setAuthMode('login')}/>}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );

  const nav=[['overview','Огляд'],['products','Товари'],['orders','Замовлення'],...(isAdmin?[['team','Команда'],['company','Компанія']]:[]),['profile','Профіль']];
  const title={overview:'Огляд',products:'Товари',orders:'Замовлення',team:'Команда',company:'Компанія',profile:'Профіль'}[tab];
  return (
    <SafeAreaView style={styles.safe}><StatusBar barStyle="dark-content" backgroundColor="#fff"/>
      <View style={styles.topbar}><View><Text style={styles.topBrand}>DM-System</Text><Text style={styles.topCompany}>{company?.name||user.companyName||'Робочий простір'}</Text></View><View style={styles.avatar}><Text style={styles.avatarText}>{(user.name||'U').slice(0,1).toUpperCase()}</Text></View></View>
      <ScrollView style={styles.main} contentContainerStyle={styles.mainContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.pageTitle}>{title}</Text>
        {!!feedback&&<Text style={styles.feedback}>{feedback}</Text>}
        {tab==='overview'&&<View>
          <Text style={styles.muted}>Вітаємо, {user.name}</Text>
          <View style={styles.stats}><Stat value={products.length} label="Товарів"/><Stat value={myOrders.length} label="Замовлень"/><Stat value={totalStock} label="Залишок на складі"/><Stat value={money(stockValue)} label="Вартість залишків"/></View>
          <Text style={styles.sectionTitle}>Останні замовлення</Text>
          {myOrders.slice(0,4).map(o=><OrderItem key={o.id} order={o} money={money} statuses={statuses}/>)}
          <Action title="Переглянути товари" onPress={()=>setTab('products')}/><Action title="Переглянути замовлення" kind="secondary" onPress={()=>setTab('orders')}/>
        </View>}
        {tab==='products'&&<View>
          {isAdmin&&<View style={styles.card}>
            <Text style={styles.sectionTitle}>{editingProduct?'Редагування товару':'Додати товар'}</Text>
            <ProductForm value={productForm} onChange={setProductForm} categories={categories}/>
            <Action title={busy?'Збереження…':editingProduct?'Зберегти зміни':'Зберегти товар'} onPress={saveProduct} disabled={busy}/>
            {editingProduct&&<Action title="Скасувати" kind="secondary" onPress={()=>setEditingProduct(null)}/>}
          </View>}
          <Field label="Пошук товарів" value={search} onChangeText={setSearch} placeholder="Назва, артикул або опис"/>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:12}}>{['all',...new Set([...categories,...products.map(p=>p.category)])].map(c=><TouchableOpacity key={c} style={[styles.chip,filter===c&&styles.chipActive]} onPress={()=>setFilter(c)}><Text style={[styles.chipText,filter===c&&styles.chipTextActive]}>{c==='all'?'Усі категорії':c}</Text></TouchableOpacity>)}</ScrollView>
          <FlatList data={visibleProducts} scrollEnabled={false} keyExtractor={x=>x.id} ListEmptyComponent={<Empty text="Товарів не знайдено."/>} renderItem={({item})=><ProductItem product={item} money={money} admin={isAdmin} onEdit={()=>openProduct(item)} onDelete={()=>deleteProduct(item)}/>}/>
        </View>}
        {tab==='orders'&&<View>
          <View style={styles.stats}><Stat value={myOrders.length} label="Усього"/><Stat value={myOrders.filter(o=>o.status==='NEW').length} label="Нові"/><Stat value={myOrders.filter(o=>o.status==='PROCESSING').length} label="В обробці"/><Stat value={myOrders.filter(o=>o.status==='COMPLETED').length} label="Виконані"/></View>
          {!isAdmin&&<View style={styles.card}><Text style={styles.sectionTitle}>Нове замовлення</Text>
            <Field label="Ім’я клієнта" value={orderForm.customerName} onChangeText={v=>setOrderForm({...orderForm,customerName:v})} placeholder="Ім’я клієнта"/>
            <Field label="Телефон клієнта" value={orderForm.customerPhone} onChangeText={v=>setOrderForm({...orderForm,customerPhone:v})} placeholder="+380..." keyboardType="phone-pad"/>
            {orderForm.items.map((row,index)=><View key={index} style={styles.itemForm}>
              <Text style={styles.label}>Товар {index+1}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>{products.filter(p=>p.stock>0&&!orderForm.items.some((r,i)=>i!==index&&r.productId===p.id)).map(p=><TouchableOpacity key={p.id} onPress={()=>updateOrderRow(index,'productId',p.id)} style={[styles.chip,row.productId===p.id&&styles.chipActive]}><Text style={[styles.chipText,row.productId===p.id&&styles.chipTextActive]}>{p.name} · {p.stock} шт.</Text></TouchableOpacity>)}</ScrollView>
              <Field label="Кількість" value={row.quantity} onChangeText={v=>updateOrderRow(index,'quantity',v)} keyboardType="numeric"/>
              {orderForm.items.length>1&&<Action title="Прибрати позицію" kind="danger" onPress={()=>setOrderForm(c=>({...c,items:c.items.filter((_,i)=>i!==index)}))}/>}
            </View>)}
            <Action title="＋ Додати товар" kind="secondary" onPress={addOrderRow}/>
            <Text style={styles.total}>Сума: {money(orderTotal)}</Text>
            <Action title="Створити замовлення" onPress={createOrder} disabled={busy||!products.some(p=>p.stock>0)}/>
          </View>}
          <Field label="Пошук замовлень" value={orderSearch} onChangeText={setOrderSearch} placeholder="Номер, клієнт або товар"/>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:12}}>{['all',...Object.keys(statuses)].map(s=><TouchableOpacity key={s} style={[styles.chip,orderFilter===s&&styles.chipActive]} onPress={()=>setOrderFilter(s)}><Text style={[styles.chipText,orderFilter===s&&styles.chipTextActive]}>{s==='all'?'Усі статуси':statuses[s]}</Text></TouchableOpacity>)}</ScrollView>
          {visibleOrders.map(o=><OrderItem key={o.id} order={o} money={money} statuses={statuses} admin={isAdmin} transitions={transitions} onStatus={next=>changeOrderStatus(o,next)} onDelete={()=>deleteOrder(o)}/>)}
          {!visibleOrders.length&&<Empty text="Замовлень не знайдено."/>}
        </View>}
        {tab==='team'&&isAdmin&&<View>
          <View style={styles.card}><Text style={styles.sectionTitle}>Запросити дропшипера</Text><Text style={styles.muted}>Створи одноразовий код, дійсний 7 днів.</Text><Action title="Створити запрошення" onPress={createInvite} disabled={busy}/>{!!inviteCode&&<TouchableOpacity onPress={()=>Alert.alert('Код запрошення',inviteCode)} style={styles.invite}><Text style={styles.inviteCode}>{inviteCode}</Text><Text style={styles.muted}>Натисни, щоб переглянути код</Text></TouchableOpacity>}</View>
          {users.map(m=><View key={m.id} style={styles.card}><Text style={styles.itemTitle}>{m.name}</Text><Text style={styles.muted}>{m.email}</Text><Text style={styles.accent}>{m.role==='ADMIN'?'Адміністратор':'Дропшипер'} · {m.isActive?'Активний':'Деактивований'}</Text><Text style={styles.muted}>Реєстрація: {date(m.createdAt)}</Text><Action title={m.isActive?'Деактивувати':'Активувати'} kind="secondary" onPress={()=>updateUserStatus(m)}/></View>)}
          <Text style={styles.sectionTitle}>Запрошення</Text>
          {invitations.map(i=><View key={i.id} style={styles.card}><Text style={styles.itemTitle}>Створено: {date(i.createdAt)}</Text><Text style={styles.muted}>Дійсне до: {date(i.expiresAt)}</Text><Text style={styles.accent}>{i.isUsable?'Активне':i.revokedAt?'Відкликане':'Недійсне'} · {i.usesCount?'Використане':'Не використане'}</Text>{i.isUsable&&<Action title="Відкликати" kind="danger" onPress={()=>revokeInvite(i)}/>}</View>)}
        </View>}
        {tab==='company'&&isAdmin&&<View style={styles.card}><Text style={styles.sectionTitle}>Профіль компанії</Text><Field label="Назва компанії" value={companyName} onChangeText={setCompanyName}/><Action title="Зберегти зміни" onPress={saveCompany}/><Text style={styles.muted}>Власник: {company?.ownerName||'—'}</Text><Text style={styles.muted}>Створено: {date(company?.createdAt)}</Text><Text style={styles.muted}>ID: {company?.id||'—'}</Text></View>}
        {tab==='profile'&&<View style={styles.card}><Text style={styles.itemTitle}>{user.name}</Text><Text style={styles.muted}>{user.email}</Text><Text style={styles.accent}>{isAdmin?'Адміністратор':'Дропшипер'}</Text><Text style={styles.muted}>Компанія: {company?.name||user.companyName}</Text><Action title="Оновити дані" kind="secondary" onPress={()=>run(loadData,'Дані оновлено.')}/><Action title="Вийти з акаунта" kind="danger" onPress={logout}/></View>}
        <Action title={refreshing?'Оновлення…':'Оновити дані'} kind="secondary" onPress={refresh} disabled={refreshing}/>
      </ScrollView>
      <View style={styles.bottomNav}>{nav.map(([id,label])=><TouchableOpacity key={id} style={styles.navItem} onPress={()=>{setTab(id);setFeedback('');setEditingProduct(null)}}><Text style={[styles.navLabel,tab===id&&styles.navActive]}>{label}</Text><View style={[styles.navDot,tab===id&&styles.navDotActive]}/></TouchableOpacity>)}</View>
    </SafeAreaView>
  );
}

function Field({label,...props}) { return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput style={styles.input} placeholderTextColor="#98a2b3" {...props}/></View>; }
function Action({title,onPress,kind='primary',disabled=false}) { return <TouchableOpacity activeOpacity={0.8} disabled={disabled} onPress={onPress} style={[styles.button,kind==='secondary'&&styles.secondaryButton,kind==='link'&&styles.linkButton,kind==='danger'&&styles.dangerButton,disabled&&{opacity:0.5}]}><Text style={[styles.buttonText,kind!=='primary'&&styles.secondaryText,kind==='danger'&&{color:'#c03945'}]}>{title}</Text></TouchableOpacity>; }
function Stat({value,label}) { return <View style={styles.stat}><Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>{value}</Text><Text style={styles.muted}>{label}</Text></View>; }
function Empty({text}) { return <View style={styles.empty}><Text style={styles.muted}>{text}</Text></View>; }

const styles=StyleSheet.create({
 safe:{flex:1,backgroundColor:'#f4f6fb'},authWrap:{flex:1},authContent:{flexGrow:1,justifyContent:'center',padding:22},
 brand:{fontSize:36,fontWeight:'900',color:'#1b2854',textAlign:'center',marginBottom:8},subtitle:{fontSize:16,color:'#788397',textAlign:'center',marginBottom:36},
 topbar:{backgroundColor:'#fff',paddingHorizontal:20,paddingVertical:13,borderBottomWidth:1,borderBottomColor:'#e5e9f0',flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
 topBrand:{fontSize:23,fontWeight:'900',color:'#1b2854'},topCompany:{fontSize:13,color:'#788397',marginTop:3},avatar:{width:42,height:42,borderRadius:22,backgroundColor:'#e2edff',alignItems:'center',justifyContent:'center'},avatarText:{fontSize:20,fontWeight:'800',color:'#2860c9'},
 main:{flex:1},mainContent:{padding:18,paddingBottom:30},pageTitle:{fontSize:28,fontWeight:'900',color:'#151d30',marginBottom:16},heading:{fontSize:25,fontWeight:'900',color:'#151d30',marginBottom:20},sectionTitle:{fontSize:19,fontWeight:'800',color:'#172033',marginBottom:14},muted:{fontSize:14,color:'#778397',marginBottom:10},card:{backgroundColor:'#fff',borderWidth:1,borderColor:'#e1e6ee',borderRadius:20,padding:16,marginBottom:16},
 field:{marginBottom:13},label:{fontSize:14,fontWeight:'700',color:'#596579',marginBottom:7},input:{minHeight:49,borderWidth:1,borderColor:'#dce2eb',borderRadius:13,paddingHorizontal:14,paddingVertical:11,fontSize:16,color:'#172033',backgroundColor:'#fff'},
 button:{minHeight:49,backgroundColor:'#2863e8',borderRadius:13,alignItems:'center',justifyContent:'center',paddingHorizontal:16,marginTop:8,marginBottom:5},buttonText:{fontSize:16,fontWeight:'800',color:'#fff'},secondaryButton:{backgroundColor:'#f3f6fb',borderWidth:1,borderColor:'#d4dce8'},linkButton:{backgroundColor:'transparent'},dangerButton:{backgroundColor:'#fff2f2',borderWidth:1,borderColor:'#f4d0d2'},secondaryText:{color:'#3b4a61'},
 stats:{flexDirection:'row',flexWrap:'wrap',gap:10,marginVertical:16},stat:{width:'48%',minHeight:100,backgroundColor:'#fff',borderRadius:17,borderWidth:1,borderColor:'#e1e6ee',padding:14,justifyContent:'center'},statValue:{fontSize:23,fontWeight:'900',color:'#2860c9',marginBottom:7},
 itemTitle:{fontSize:17,fontWeight:'800',color:'#172033',marginBottom:5},accent:{fontSize:14,fontWeight:'700',color:'#2860c9',marginTop:8,marginBottom:6},chip:{paddingHorizontal:13,paddingVertical:10,backgroundColor:'#edf1f7',borderRadius:11,marginRight:8,marginBottom:4},chipActive:{backgroundColor:'#e1ebff',borderWidth:1,borderColor:'#9bb9f4'},chipText:{fontSize:13,color:'#4b586b'},chipTextActive:{color:'#2458be',fontWeight:'800'},itemForm:{padding:12,borderRadius:13,backgroundColor:'#f7f9fc',marginBottom:12},total:{fontSize:17,fontWeight:'900',color:'#2860c9',textAlign:'right',marginVertical:12},invite:{backgroundColor:'#eef4ff',padding:15,borderRadius:13,alignItems:'center',marginTop:10},inviteCode:{fontSize:23,fontWeight:'900',color:'#2458be',letterSpacing:1},feedback:{color:'#237b4d',backgroundColor:'#e8f7ee',padding:11,borderRadius:10,marginBottom:12},empty:{padding:24,backgroundColor:'#fff',borderRadius:14,alignItems:'center',marginBottom:14},
 bottomNav:{flexDirection:'row',backgroundColor:'#fff',borderTopWidth:1,borderTopColor:'#e1e6ee',paddingTop:9,paddingBottom:Platform.OS==='android'?8:2},navItem:{flex:1,alignItems:'center',paddingVertical:6},navLabel:{fontSize:11,color:'#8590a2',fontWeight:'600'},navActive:{color:'#2860c9',fontWeight:'900'},navDot:{width:5,height:5,borderRadius:3,backgroundColor:'transparent',marginTop:5},navDotActive:{backgroundColor:'#2860c9'}
});
