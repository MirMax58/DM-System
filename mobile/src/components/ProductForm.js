import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
export default function ProductForm({value,onChange,categories}) {
 const field=(label,key,props={})=><View style={s.field}><Text style={s.label}>{label}</Text><TextInput value={value[key]} onChangeText={v=>onChange({...value,[key]:v})} style={s.input} placeholder={label} placeholderTextColor="#98a2b3" {...props}/></View>;
 return <View>
  {field('Назва товару','name')}
  {field('Артикул (SKU)','sku',{autoCapitalize:'characters'})}
  <Text style={s.label}>Категорія</Text><ScrollView horizontal>{categories.map(c=><TouchableOpacity key={c} onPress={()=>onChange({...value,category:c})} style={[s.chip,value.category===c&&s.active]}><Text style={{color:value.category===c?'#2458be':'#4b586b'}}>{c}</Text></TouchableOpacity>)}</ScrollView>
  <View style={s.row}>{field('Ціна, грн','price',{keyboardType:'decimal-pad'})}{field('Залишок','stock',{keyboardType:'numeric'})}</View>
  {field('Опис товару','description',{multiline:true})}
 </View>;
}
const s=StyleSheet.create({field:{flex:1,marginBottom:12},label:{fontSize:13,fontWeight:'700',color:'#596579',marginBottom:6},input:{borderWidth:1,borderColor:'#dce2eb',borderRadius:12,padding:12,fontSize:15,color:'#172033',minHeight:46},row:{flexDirection:'row',gap:10},chip:{padding:10,backgroundColor:'#edf1f7',borderRadius:10,marginRight:7,marginVertical:8},active:{backgroundColor:'#e1ebff',borderWidth:1,borderColor:'#9bb9f4'}});
