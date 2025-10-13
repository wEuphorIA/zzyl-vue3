<!--添加老人选择老人弹层-->
<template>
  <div class="dialogBox tableDialog oldSelectDialog">
    <el-dialog
      title="选择老人"
      v-model="visible"
      class="elDialogBox"
      @close="handleClose"
    >
      <div class="dialogCenter">
        <!-- 搜索 -->
        <el-form
          :model="searchData"
          ref="ruleForm"
          :inline="true"
          label-width="68px"
        >
          <el-form-item label="老人姓名" prop="elderName">
            <el-input
              v-model="searchData.elderName"
              placeholder="请输入老人姓名"
              clearable
              @keyup.enter="handleSearch"
            />
          </el-form-item>
          <el-form-item label="身份证号" prop="idCard">
            <el-input
              v-model="searchData.idCard"
              placeholder="请输入身份证号"
              clearable
              @keyup.enter="handleSearch"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleSearch"
              >搜索</el-button
            >
            <el-button icon="Refresh" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>

        <!-- end -->
        <el-table
          v-loading="loading"
          row-key="id"
          :data="dialogData"
          @row-click="chooseone"
          @current-change="handleCurrentChange"
        >
          <el-table-column width="55">
            <template #default="scope">
              <el-radio v-model="selectedRowKeys" :label="scope.row.id"
                ><span class="el-radio__label"></span
              ></el-radio>
            </template>
          </el-table-column>
          <el-table-column label="序号" type="index" width="50" />
          <el-table-column label="老人姓名" align="center" prop="elderName" />
          <el-table-column label="身份证号" align="center" prop="idCard" />
          <el-table-column label="健康评分" align="center" prop="healthScore" />
          <el-table-column
            label="推荐护理等级"
            align="center"
            prop="nursingLevelName"
          />
        </el-table>
        <pagination
          v-show="pagination.total > 0"
          :total="pagination.total"
          v-model:page="pagination.pageNum"
          v-model:limit="pagination.pageSize"
          @pagination="getList"
        />
        <!-- end -->
        <!-- 底部按钮 -->
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSub">确 定</el-button>
          <el-button @click="handleClose">取 消</el-button>
        </div>
        <!-- end -->
      </div>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { COLUMNS } from './constants';
import { ElMessage } from 'element-plus';
// 组件
import NoData from '@/components/noData/index.vue';
// 获取父组件值、方法
const props = defineProps({
  // 获取列表数据
  dialogData: {
    type: Array,
    default: () => [],
  },
  // 弹层隐藏显示
  dialogVisible: {
    type: Boolean,
    default: false,
  },
  // 分页
  pagination: {
    type: Object,
    default: () => ({}),
  },
  // 加载状态
  dataLoading: {
    type: Boolean,
    default: false,
  },
  // 基本信息
  formData: {
    type: Object,
    default: () => ({}),
  },
});
// ------定义变量------
const emit = defineEmits([
  'handleCloseDialog',
  'getCurrent',
  'getOldList',
  'handleSelectOld',
  'handleSearch',
  'handleReset',
]); // 子组件获取父组件事件传值
const regTable = ref(); // 定义表格ref
const ruleForm = ref(null); // 定义表单ref
const visible = ref(false); // 用来控制弹层显示隐藏
const selectedRowKeys = ref([]); // 选中的数据
const checkTabData = reactive<Object | any>({}); // 选中的list
const searchData = ref({});
// 监听弹层是显示还是隐藏
watch(props, (val) => {
  visible.value = val.dialogVisible;
  if (visible.value) {
    // 回显选中的老人
    if (val.formData.id !== undefined) {
      selectedRowKeys.value = [val.formData.id];
    }
  }
});
// ------定义方法------
// 确认提交
const handleSub = async () => {
  // checkTabData.value是选择的内容传给父组件
  if (selectedRowKeys.value.length === 0) {
    ElMessage.error('未选择老人，请选择老人信息');
  } else {
    emit('handleSelectOld', checkTabData.value);
    handleClose();
  }
};
// 关闭弹层
const handleClose = () => {
  ruleForm.value.resetFields(); // 清除表单
  emit('handleCloseDialog');
};
// 触发复选框
const handleChangeSelection = (index, { selectedRowData }) => {
  selectedRowKeys.value = index;
  checkTabData.value = selectedRowData;
};
// 点击翻页
const onPageChange = (pageInfo) => {
  emit('getCurrent', pageInfo);
};
// 搜索
const handleSearch = () => {
  emit('handleSearch',searchData.value);
};
// 清空搜索数据
const handleReset = () => {
  ruleForm.value.resetFields(); // 清除表单
  emit('handleReset');
};
const getList = (val) => {
  emit('getOldList', val);
};
// 触发单选框
const handleCurrentChange = (row) => {
  checkTabData.value = row;
};
const chooseone = (row) => {
  selectedRowKeys.value = row.elderId;
};
</script>
