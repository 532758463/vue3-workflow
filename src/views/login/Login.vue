<script lang="ts" setup>
import { ref, reactive, type UnwrapRef } from 'vue';
import {
  FormItem,
  Form,
  Input,
  Button,
  Checkbox,
  InputPassword
} from 'ant-design-vue';
import { login } from '@/service/login';
import { useRouter } from 'vue-router';

interface FormData {
  username: string;
  password: string;
}

const formRef = ref();
const router = useRouter();

const formData: UnwrapRef<FormData> = reactive({
  username: '',
  password: ''
});
const rules = {
  username: {
    required: true,
    message: '账号必填'
  },
  password: {
    required: true,
    message: '密码不能为空'
  }
};

const onSubmit = async () => {
  try {
    await formRef.value.validate();
    const content: any = await login(formData.username, formData.password);
    const data = content?.data;
    console.log(data);
    localStorage.setItem('access_token', data.accessToken);
    localStorage.setItem('refresh_token', data.refreshToken);
    localStorage.setItem('user_info', JSON.stringify(data.userInfo));
    router.push('/');
  } catch (error) {
    console.log('error', error);
  }
};

// 注销
const onLogout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_info');
  router.go(0);
};

const hasLogin = !!localStorage.getItem('access_token');
</script>
<template>
  <div class="w-full h-full px-10 login-box">
    <div class="flex w-full h-full">
      <div class="justify-center hidden h-full pl-4 my-auto mr-4 flex-items-center z-2 xl:flex xl:flex-col xl:w-6/12">
        <img src="@/assets/login-box-bg.svg" class="w-1/2 mt-16" />
        <div class="mt-10 text-3xl font-medium text-white">开发提效平台</div>
      </div>
      <div class="flex-auto flex-justify-self-center flex-self-center">
        <div v-if="!hasLogin" class="w-3/4 m-a">
          <h2 class="mb-3 text-2xl font-bold text-center xl:text-3xl xl:text-left">
            登录
          </h2>
          <Form :model="formData" :rules="rules" class="p-4" ref="formRef">
            <FormItem name="username">
              <Input v-model:value="formData.username" size="large" placeholder="账号" class="fix-auto-fill" />
            </FormItem>
            <FormItem name="password">
              <InputPassword v-model:value="formData.password" size="large" placeholder="密码" />
            </FormItem>
            <ARow>
              <ACol :span="12">
                <FormItem>
                  <!-- No logic, you need to deal with it yourself -->
                  <Checkbox size="small"> 记住密码 </Checkbox>
                </FormItem>
              </ACol>
              <ACol :span="12">
                <FormItem :style="{ 'text-align': 'right' }">
                  <!-- No logic, you need to deal with it yourself -->
                  <Button type="link" size="small"> 忘记密码 </Button>
                </FormItem>
              </ACol>
            </ARow>

            <FormItem>
              <Button type="primary" size="large" @click="onSubmit" block>
                登录
              </Button>
            </FormItem>
          </Form>
        </div>
        <div v-else>
          <Button @click="onLogout">注销</Button>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="less">
.login-box {
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    margin-left: -48%;
    background-image: url('@/assets/login-bg.svg');
    background-repeat: no-repeat;
    background-position: 100%;
    background-size: auto 100%;
  }
}
</style>
