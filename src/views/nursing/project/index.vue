<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>

      <el-form-item label="状态" prop="name">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择"
          clearable
          style="width: 240px"
        >
          <el-option
            v-for="item in nursing_project_status"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['nursing:project:add']"
          >新增</el-button
        >
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="projectList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" width="50" />
      <el-table-column label="名称" align="center" prop="name" width="150" />
      <el-table-column
        label="排序号"
        align="center"
        prop="orderNo"
        width="80"
      />
      <el-table-column label="单位" align="center" prop="unit" width="100" />
      <el-table-column label="价格" align="center" prop="price" width="100" />
      <el-table-column label="图片" align="center" prop="image" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.image" :width="50" :height="50" />
        </template>
      </el-table-column>
      <el-table-column
        label="护理要求"
        align="center"
        prop="nursingRequirement"
        width="100"
      />
      <el-table-column label="状态" align="center" prop="status" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.status == 1 ? 'success' : 'danger'">{{
            scope.row.status === 1 ? '启用' : '禁用'
          }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" align="center" prop="createTime">
        <template #default="scope">
          <span>{{
            parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}')
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        width="200"
      >
        <template #default="scope">
          <el-button
            link
            type="primary"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['nursing:project:edit']"
            >修改</el-button
          >
          <el-button
            link
            type="primary"
            icon="Delete"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
          <el-button
            link
            type="primary"
            :icon="scope.row.status == 0 ? 'Unlock' : 'lock'"
            @click="handleEnable(scope.row)"
            >{{ scope.row.status == 1 ? '禁用' : '启用' }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改护理项目对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="projectRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入名称"
            maxlength="20"
          />
        </el-form-item>
        <el-form-item label="排序号" prop="orderNo">
          <el-input-number
            v-model="form.orderNo"
            :min="1"
            :max="10"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input v-model="form.unit" placeholder="请输入单位" />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number
            v-model="form.price"
            :min="1"
            :max="100"
            :step="1"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in nursing_project_status"
              :key="dict.value"
              :label="dict.value"
              >{{ dict.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="图片" prop="image">
          <image-upload v-model="form.image" />
        </el-form-item>
        <el-form-item label="护理要求" prop="nursingRequirement">
          <el-input
            v-model="form.nursingRequirement"
            placeholder="请输入护理要求"
            autosize
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Project">
import {
  listProject,
  getProject,
  delProject,
  addProject,
  updateProject,
} from '@/api/nursing/project';

const { proxy } = getCurrentInstance();

const projectList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref('');
const form = ref({});
const status = ref(0);

const { nursing_project_status } = proxy.useDict('nursing_project_status');

/* const options = [
  {
    value: '1',
    label: '启用',
  },
  {
    value: '0',
    label: '禁用',
  }
] */

const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  name: null,
  status: null,
});
const rules = ref({
  name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
  price: [{ required: true, message: '价格不能为空', trigger: 'blur' }],
  image: [{ required: true, message: '图片不能为空', trigger: 'blur' }],
  createTime: [
    { required: true, message: '创建时间不能为空', trigger: 'blur' },
  ],
});

// const data = reactive({

//   queryParams: {
//     pageNum: 1,
//     pageSize: 10,
//     name: null,
//     status: null,
//   },
//   rules: {
//     name: [
//       { required: true, message: "名称不能为空", trigger: "blur" }
//     ],
//     price: [
//       { required: true, message: "价格不能为空", trigger: "blur" }
//     ],
//     image: [
//       { required: true, message: "图片不能为空", trigger: "blur" }
//     ],
//     createTime: [
//       { required: true, message: "创建时间不能为空", trigger: "blur" }
//     ],
//   }
// });

// const { queryParams, form, rules } = toRefs(data);

/** 查询护理项目列表 */
function getList() {
  loading.value = true;
  listProject(queryParams.value).then((response) => {
    projectList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    name: null,
    orderNo: null,
    unit: null,
    price: null,
    image: null,
    nursingRequirement: null,
    status: null,
    createBy: null,
    updateBy: null,
    remark: null,
    createTime: null,
    updateTime: null,
  };
  proxy.resetForm('projectRef');
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm('queryRef');
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = '添加护理项目';
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value;
  getProject(_id).then((response) => {
    form.value = response.data;
    form.value.status = form.value.status.toString();
    open.value = true;
    title.value = '修改护理项目';
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs['projectRef'].validate((valid) => {
    if (valid) {
      if (form.value.id != null) {
        updateProject(form.value).then((response) => {
          proxy.$modal.msgSuccess('修改成功');
          open.value = false;
          getList();
        });
      } else {
        addProject(form.value).then((response) => {
          proxy.$modal.msgSuccess('新增成功');
          open.value = false;
          getList();
        });
      }
    }
  });
}

// 使用 async/await 语法优化异步操作
const handleEnable = async (row) => {
  try {
    // 获取状态
    const status = row.status;
    const info = status === 0 ? '启用' : '禁用';

    // 使用模板字符串
    const confirmMessage = `是否确认${info}护理项目的数据项？`;

    // 确认操作
    if (await proxy.$modal.confirm(confirmMessage)) {
      // 更新参数
      const param = {
        id: row.id,
        status: status === 0 ? 1 : 0,
      };

      // 执行更新操作
      await updateProject(param);
      // 刷新列表
      getList();
      // 成功消息
      proxy.$modal.msgSuccess(`${info}成功`);
    }
  } catch (error) {
    // 异常处理：这里可以根据实际需求进行调整，例如打印错误日志或显示用户友好的错误信息
    console.error('操作失败，请重试或联系管理员。');
  }
};

/* //启用或禁用
const handleEnable = (row) =>{

  //获取状态
  const status = row.status;
  const info = status == 0 ? '启用' :  '禁用';

  const param = {
    id: row.id,
    status: status == 0 ? 1 : 0
  }

  proxy.$modal.confirm('是否确认'+info+'护理项目的数据项？').then(function() {
    return updateProject(param);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
} */

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal
    .confirm('是否确认删除护理项目编号为"' + _ids + '"的数据项？')
    .then(function () {
      return delProject(_ids);
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess('删除成功');
    })
    .catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download(
    'nursing/project/export',
    {
      ...queryParams.value,
    },
    `project_${new Date().getTime()}.xlsx`
  );
}

getList();
</script>
