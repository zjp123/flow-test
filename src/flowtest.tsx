import { useState, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  NodeTypes,
  Handle,
  Position,
  MarkerType,
} from '@xyflow/react';
import { Button, Popover } from 'antd';
import '@xyflow/react/dist/style.css';
import './flowtest.css';
import { ApartmentOutlined } from '@ant-design/icons';
// import { PlusCircleOutlined } from '@ant-design/icons';

// 节点数据类型
interface NodeData {
  label: string;
  content: string;
  hasError?: boolean;
  branchId?: string;
  onDelete?: () => void;
  onConfig?: () => void;
  onAddCondition?: (type: string) => void;
  onAddApproval?: (branchId?: string) => void;
  showActions?: boolean;
}

// 提交节点组件
function SubmitNode({ data }: { data: NodeData }) {
  return (
    <div className="flow-node flow-node-submit">
      <Handle type="source" position={Position.Bottom} />
      <div className="flow-node-header">{data.label}</div>
      <div className="flow-node-content">
        <div className="flow-node-button">{data.content}</div>
      </div>
    </div>
  );
}

// 条件节点组件
function ConditionNode({ data }: { data: NodeData }) {
  return (
    <div className="flow-node flow-node-condition">
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      {/* {data.onDelete && (
        <div className="flow-node-delete" onClick={data.onDelete}>
          ×
        </div>
      )} */}
      <div className="flow-node-header">{data.label}</div>
      <div className="flow-node-content" onClick={data.onConfig}>
        <span className="flow-node-text">
          {data.content}
          {data.hasError && <span className="flow-node-error">!</span>}
        </span>
        <span className="flow-node-arrow">›</span>
      </div>
    </div>
  );
}

// 审批节点组件
function ApprovalNode({ data }: { data: NodeData }) {
  const [showActions, setShowActions] = useState(false);

  const handleDeleteClick = () => {
    setShowActions(true);
  };

  const handleCancel = () => {
    setShowActions(false);
  };

  const handleConfirm = () => {
    data.onDelete?.();
    setShowActions(false);
  };

  return (
    <div className="flow-node flow-node-approval">
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      {data.onDelete && !showActions && (
        <div className="flow-node-delete" onClick={handleDeleteClick}>
          ×
        </div>
      )}
      {showActions && (
        <div className="flow-node-actions">
          <Button size="small" className="action-btn" onClick={handleCancel}>取消</Button>
          <Button size="small" type="primary" className="action-btn" onClick={handleConfirm}>确定</Button>
        </div>
      )}
      <div className="flow-node-header">{data.label}</div>
      <div className="flow-node-content" onClick={data.onConfig}>
        <span className="flow-node-text">
          {data.content}
          {data.hasError && <span className="flow-node-error">!</span>}
        </span>
        <span className="flow-node-arrow">›</span>
      </div>
    </div>
  );
}

// 结束节点组件
function EndNode({ data }: { data: NodeData }) {
  return (
    <div className="flow-node flow-node-end">
      <Handle type="target" position={Position.Top} />
      <div className="flow-node-header">{data.label}</div>
      <div className="flow-node-content" onClick={data.onConfig}>
        <span className="flow-node-text">{data.content}</span>
        <span className="flow-node-arrow">›</span>
      </div>
    </div>
  );
}

// 添加条件按钮节点
function AddConditionNode({ data }: { data: NodeData }) {
  const [open, setOpen] = useState(false);

  const menu = (
    <div className="add-condition-menu">
      <div 
        className="add-condition-menu-item" 
        onClick={() => {
          data.onAddCondition?.('通用条件');
          setOpen(false);
        }}
      >
        {/* <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 2v12M2 8h12" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" />
        </svg> */}
        <ApartmentOutlined style={{ color: '#0EA5E9' }} />
        <span>通用条件</span>
      </div>
      <div 
        className="add-condition-menu-item"
        onClick={() => {
          data.onAddCondition?.('特殊条件');
          setOpen(false);
        }}
      >
        {/* <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 2v12M2 8h12" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" />
        </svg> */}
        <ApartmentOutlined style={{ color: '#0EA5E9' }} />
        <span>特殊条件</span>
      </div>
    </div>
  );

  return (
    <div className="add-condition-wrapper">
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      <Popover
        content={menu}
        trigger="click"
        open={open}
        onOpenChange={setOpen}
        placement="rightTop"
        arrow={false}
      >
        <div className="add-condition-button">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="16" fill="#0EA5E9" />
            <path d="M16 10v12M10 16h12" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
          {/* <PlusCircleOutlined /> */}
        </div>
      </Popover>
    </div>
  );
}

// 添加审批按钮节点
function AddApprovalNode({ data }: { data: NodeData }) {
  return (
    <div className="add-approval-wrapper">
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      <Button
        type="link"
        className="add-approval-button"
        onClick={() => data.onAddApproval?.(data.branchId)}
        icon={
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2v12M2 8h12" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" />
          </svg>
        }
      >
        添加审批
      </Button>
    </div>
  );
}

// 定义节点类型
const nodeTypes: NodeTypes = {
  submit: SubmitNode,
  condition: ConditionNode,
  approval: ApprovalNode,
  end: EndNode,
  addCondition: AddConditionNode,
  addApproval: AddApprovalNode,
};

// 流程类型
type FlowType = 'single' | 'multiple';
// 线宽是4

export default function FlowTest() {
  const [flowType, setFlowType] = useState<FlowType>('single');
  const [nodeCounter, setNodeCounter] = useState(10); // 节点计数器

  // 节点尺寸常量
  const NODE_DIMENSIONS = useMemo(() => ({
    submit: { width:244, height: 120 },
    condition: { width: 200, height: 80 },
    approval: { width: 200, height: 80 },
    end: { width: 200, height: 80 },
    addCondition: { width: 60, height: 40 },
    addApproval: { width: 120, height: 40 },
  }), []);
  const NODE_GAP = 80; // 节点间距

  // 计算中心对齐的 x 坐标
  const getCenterX = useCallback((parentX: number, parentWidth: number, childWidth: number) => {
    return parentX + parentWidth / 2 - childWidth / 2;
  }, []);

  // 单条件流程初始节点
  const submitX = 250;
  const submitY = 0;
  const addConditionX = getCenterX(submitX, NODE_DIMENSIONS.submit.width, NODE_DIMENSIONS.addCondition.width);
  const addConditionY = submitY + NODE_DIMENSIONS.submit.height + NODE_GAP;

  const singleFlowNodes: Node[] = [
    {
      id: 'submit-1',
      type: 'submit',
      position: { x: submitX, y: submitY },
      data: { label: '提交', content: '开始流程' },
    },
    {
      id: 'add-condition-1',
      type: 'addCondition',
      position: { x: addConditionX, y: addConditionY },
      data: { label: '', content: '' },
    },
    // {
    //   id: 'condition-1',
    //   type: 'condition',
    //   position: { x: 200, y: 200 },
    //   data: { label: '通用条件1', content: '请设置条件', hasError: true, branchId: 'branch-1' },
    // },
    // {
    //   id: 'approval-1',
    //   type: 'approval',
    //   position: { x: 200, y: 320 },
    //   data: { label: '审批', content: '请设置审批人', hasError: true, branchId: 'branch-1' },
    // },
    // {
    //   id: 'add-approval-1',
    //   type: 'addApproval',
    //   position: { x: 280, y: 440 },
    //   data: { label: '', content: '', branchId: 'branch-1' },
    // },
    // {
    //   id: 'end-1',
    //   type: 'end',
    //   position: { x: 200, y: 520 },
    //   data: { label: '结束', content: '可设置无需审批条件' },
    // },
  ];

  // 多条件流程初始节点
  const multipleFlowNodes: Node[] = [
    {
      id: 'submit-1',
      type: 'submit',
      position: { x: 400, y: 0 },
      data: { label: '提交', content: '开始流程' },
    },
    {
      id: 'add-condition-1',
      type: 'addCondition',
      position: { x: 430, y: 120 },
      data: { label: '', content: '' },
    },
    // 通用条件1分支
    {
      id: 'condition-1',
      type: 'condition',
      position: { x: 50, y: 200 },
      data: { label: '通用条件1', content: '已设置，查看详情', branchId: 'branch-1' },
    },
    {
      id: 'approval-1',
      type: 'approval',
      position: { x: 50, y: 320 },
      data: { label: '审批', content: '已设置，查看详情', branchId: 'branch-1' },
    },
    {
      id: 'add-approval-1',
      type: 'addApproval',
      position: { x: 130, y: 440 },
      data: { label: '', content: '', branchId: 'branch-1' },
    },
    // 特殊条件2分支
    {
      id: 'condition-2',
      type: 'condition',
      position: { x: 350, y: 200 },
      data: { label: '特殊条件2', content: '请设置条件', hasError: false, branchId: 'branch-2' },
    },
    {
      id: 'approval-2',
      type: 'approval',
      position: { x: 350, y: 320 },
      data: { label: '审批', content: '请设置审批人', hasError: false, branchId: 'branch-2' },
    },
    {
      id: 'add-approval-2',
      type: 'addApproval',
      position: { x: 430, y: 440 },
      data: { label: '', content: '', branchId: 'branch-2' },
    },
    // 通用条件3分支
    {
      id: 'condition-3',
      type: 'condition',
      position: { x: 650, y: 200 },
      data: { label: '通用条件3', content: '请设置条件', hasError: false, branchId: 'branch-3' },
    },
    {
      id: 'approval-3',
      type: 'approval',
      position: { x: 650, y: 320 },
      data: { label: '审批', content: '请设置审批人', hasError: false, branchId: 'branch-3' },
    },
    {
      id: 'add-approval-3',
      type: 'addApproval',
      position: { x: 730, y: 440 },
      data: { label: '', content: '', branchId: 'branch-3' },
    },
    {
      id: 'end-1',
      type: 'end',
      position: { x: 350, y: 540 },
      data: { label: '结束', content: '可设置无需审批条件' },
    },
  ];

  const singleFlowEdges: Edge[] = [
    { id: 'e-submit-add', source: 'submit-1', target: 'add-condition-1' },
    { id: 'e-add-condition', source: 'add-condition-1', target: 'condition-1' },
    // { id: 'e-condition-approval', source: 'condition-1', target: 'approval-1' },
    // { id: 'e-approval-add', source: 'approval-1', target: 'add-approval-1' },
    // { id: 'e-add-end', source: 'add-approval-1', target: 'end-1' },
  ];

  const multipleFlowEdges: Edge[] = [
    { id: 'e-submit-add', source: 'submit-1', target: 'add-condition-1' },
    // 分支1
    { id: 'e-add-condition-1', source: 'add-condition-1', target: 'condition-1' },
    { id: 'e-condition-1-approval-1', source: 'condition-1', target: 'approval-1' },
    { id: 'e-approval-1-add-1', source: 'approval-1', target: 'add-approval-1' },
    { id: 'e-add-approval-1-end', source: 'add-approval-1', target: 'end-1' },
    // 分支2
    { id: 'e-add-condition-2', source: 'add-condition-1', target: 'condition-2' },
    { id: 'e-condition-2-approval-2', source: 'condition-2', target: 'approval-2' },
    { id: 'e-approval-2-add-2', source: 'approval-2', target: 'add-approval-2' },
    { id: 'e-add-approval-2-end', source: 'add-approval-2', target: 'end-1' },
    // 分支3
    { id: 'e-add-condition-3', source: 'add-condition-1', target: 'condition-3' },
    { id: 'e-condition-3-approval-3', source: 'condition-3', target: 'approval-3' },
    { id: 'e-approval-3-add-3', source: 'approval-3', target: 'add-approval-3' },
    { id: 'e-add-approval-3-end', source: 'add-approval-3', target: 'end-1' },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(
    flowType === 'single' ? singleFlowNodes : multipleFlowNodes
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    flowType === 'single' ? singleFlowEdges : multipleFlowEdges
  );

  // 切换流程类型
  const switchFlowType = (type: FlowType) => {
    setFlowType(type);
    if (type === 'single') {
      setNodes(singleFlowNodes);
      setEdges(singleFlowEdges);
    } else {
      setNodes(multipleFlowNodes);
      setEdges(multipleFlowEdges);
    }
  };

  // 添加条件节点
  const handleAddCondition = useCallback((type: string) => {
    console.log('添加条件:', type);
    
    // 查找 add-condition-1 节点
    const addConditionNode = nodes.find(n => n.id === 'add-condition-1');
    if (!addConditionNode) return;

    // 生成新节点ID
    const conditionId = `condition-${nodeCounter}`;
    const approvalId = `approval-${nodeCounter}`;

    // 计算新节点位置（在 add-condition-1 下方，中心对齐）
    const conditionX = getCenterX(
      addConditionNode.position.x,
      NODE_DIMENSIONS.addCondition.width,
      NODE_DIMENSIONS.condition.width
    );
    const conditionY = addConditionNode.position.y + NODE_DIMENSIONS.addCondition.height + NODE_GAP;

    const approvalX = conditionX; // 审批节点与条件节点 x 坐标相同
    const approvalY = conditionY + NODE_DIMENSIONS.condition.height + NODE_GAP;

    // 创建新节点
    const newConditionNode: Node = {
      id: conditionId,
      type: 'condition',
      position: { x: conditionX, y: conditionY },
      data: {
        label: type,
        content: '请设置条件',
        hasError: true,
        branchId: `branch-${nodeCounter}`,
      },
    };

    const newApprovalNode: Node = {
      id: approvalId,
      type: 'approval',
      position: { x: approvalX, y: approvalY },
      data: {
        label: '审批',
        content: '请设置审批人',
        hasError: true,
        branchId: `branch-${nodeCounter}`,
      },
    };

    // 添加节点
    setNodes((nds) => [...nds, newConditionNode, newApprovalNode]);

    // 添加连接边
    const newEdges: Edge[] = [
      {
        id: `e-add-${conditionId}`,
        source: 'add-condition-1',
        target: conditionId,
        type: 'smoothstep',
        style: { stroke: '#D1D5DB', strokeWidth: 2 },
      },
      {
        id: `e-${conditionId}-${approvalId}`,
        source: conditionId,
        target: approvalId,
        type: 'smoothstep',
        style: { stroke: '#D1D5DB', strokeWidth: 2 },
      },
    ];

    setEdges((eds) => [...eds, ...newEdges]);

    // 更新计数器
    setNodeCounter(nodeCounter + 1);
  }, [nodes, nodeCounter, setNodes, setEdges, NODE_DIMENSIONS, NODE_GAP, getCenterX]);

  // 添加审批节点
  const handleAddApproval = useCallback((branchId?: string) => {
    console.log('添加审批到分支:', branchId);
    // 实现添加审批逻辑
  }, []);

  // 删除节点
  const handleDelete = useCallback((nodeId: string) => {
    console.log('删除节点:', nodeId);
    // 实现删除逻辑
  }, []);

  // 配置节点
  const handleConfig = useCallback((nodeId: string) => {
    console.log('配置节点:', nodeId);
    // 实现配置逻辑
  }, []);

  // 更新节点数据以包含回调函数
  const nodesWithCallbacks = nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      onAddCondition: handleAddCondition,
      onAddApproval: handleAddApproval,
      onDelete: node.type !== 'submit' && node.type !== 'end' && node.type !== 'addCondition' && node.type !== 'addApproval'
        ? () => handleDelete(node.id)
        : undefined,
      onConfig: () => handleConfig(node.id),
    },
  }));

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#F6F7F8' }}>
      <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 10 }}>
        <Button 
          type={flowType === 'single' ? 'primary' : 'default'}
          onClick={() => switchFlowType('single')}
          style={{ marginRight: 8 }}
        >
          单条件流程
        </Button>
        <Button 
          type={flowType === 'multiple' ? 'primary' : 'default'}
          onClick={() => switchFlowType('multiple')}
        >
          多条件流程
        </Button>
      </div>
      <ReactFlow
        nodes={nodesWithCallbacks}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{
          type: 'smoothstep',
          style: { stroke: '#D1D5DB', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#D1D5DB' },
        }}
      />
    </div>
  );
}

