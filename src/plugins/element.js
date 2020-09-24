import Vue from 'vue'
import { Button, Form, FormItem, Input, Header, Container, Aside, Main, Menu, Submenu, MenuItem, Table, TableColumn, Link, Dialog, Upload, Message, MessageBox, Select, Option, Pagination, TimePicker, Radio, Tree } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Header)
Vue.use(Radio)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(TimePicker)
Vue.use(Link)
Vue.use(Dialog)
Vue.use(Tree)
Vue.use(Upload)
Vue.use(Select)
Vue.use(Option)
Vue.use(Pagination)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
