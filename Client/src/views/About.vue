<template>
  <div class="about">
    <h1>My name is {{ name }} </h1>
    <h2>{{email}}</h2>
  </div>
</template>

<script>


export default {
 
  created(){
     this.checkLogin()
  },
  methods:{
    checkLogin(){
          const token =  localStorage.getItem('token')
        if(!token){
       this.$router.push('/login');
      }
    }
  },
  data () {
    return {
      name:localStorage.getItem('name') ,
      email:localStorage.getItem('email')
    }
  },
}
</script>