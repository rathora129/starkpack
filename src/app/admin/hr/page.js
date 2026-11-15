'use client';

import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  Plus,
  CalendarClock,
  Check,
  X,
  Mail,
  Phone,
  ArrowRight,
  Download,
  Pencil,
  Trash2,
  ClipboardList,
  Wallet,
  UserCheck,
  Eye,
  Printer,
} from 'lucide-react';
import { useDemoStore } from '@/store/useDemoStore';
import { notify } from '@/store/useUiStore';
import { formatDate, formatINR, formatNumber, statusTone, downloadCSV, todayISO } from '@/lib/format';
import { colors, fonts, radii } from '@/lib/theme';
import {
  PageHeaderBar,
  PageHeading,
  PageDescription,
  PageActions,
  Button,
  Panel,
  PanelHeader,
  PanelTitle,
  PanelBody,
  StatusChip,
  Avatar,
  Divider,
  ProgressTrack,
  ProgressFill,
} from '@/components/ui/primitives';
import { FilterChips, SearchInput, Toolbar } from '@/components/ui/Controls';
import { DataTable, CellPrimary, CellSecondary, CellStrong } from '@/components/ui/DataTable';
import {
  AppModal,
  Drawer,
  ConfirmDialog,
  DetailGrid,
  DetailItem,
  DetailLabel,
  DetailValue,
} from '@/components/ui/Overlay';
import { TextField, TextAreaField, SelectField, FormGrid, FormActions } from '@/components/ui/FormFields';
import MiniStats from '@/components/dashboard/MiniStats';

const LeaveTop = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;

  div {
    flex: 1;
    min-width: 0;
  }

  strong {
    display: block;
    font-size: 11.5px;
    font-weight: 700;
    color: ${colors.ink};
  }

  span {
    display: block;
    font-size: 9.5px;
    color: ${colors.faint};
    margin-top: 1px;
  }
`;

const LeaveActions = styled.div`
  display: flex;
  gap: 5px;
  margin-top: 8px;
  padding-left: 37px;
`;

const DeptRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;

  span:first-child {
    width: 92px;
    font-size: 11px;
    color: ${colors.inkSoft};
    font-weight: 600;
  }

  em {
    font-style: normal;
    font-size: 10px;
    font-weight: 700;
    color: ${colors.muted};
    width: 22px;
    text-align: right;
  }
`;

const PersonHead = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 16px;

  strong {
    display: block;
    font-size: 15px;
    color: ${colors.ink};
  }

  span {
    display: block;
    margin-top: 2px;
    font-size: 11.5px;
    color: ${colors.muted};
  }
`;

const Contact = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: ${colors.inkSoft};
  padding: 5px 0;

  svg {
    color: ${colors.faint};
  }

  &:hover {
    color: ${colors.forest};
  }
`;

const SectionLabel = styled.p`
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${colors.faint};
  margin-bottom: 9px;
`;

const TaskRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 9px;
  padding: 9px 0;
  border-bottom: 1px solid ${colors.lineSoft};

  &:last-child {
    border-bottom: 0;
  }

  div {
    flex: 1;
    min-width: 0;
  }

  strong {
    display: block;
    font-size: 11.5px;
    color: ${({ $done }) => ($done ? colors.faint : colors.ink)};
    text-decoration: ${({ $done }) => ($done ? 'line-through' : 'none')};
    line-height: 1.4;
  }

  span {
    display: block;
    margin-top: 2px;
    font-size: 10px;
    color: ${colors.faint};
  }
`;

const SalaryRow = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 10px 0;
  border-bottom: 1px solid ${colors.lineSoft};

  &:last-child {
    border-bottom: 0;
  }

  div {
    flex: 1;
    min-width: 0;
  }

  strong {
    display: block;
    font-size: 11.5px;
    color: ${colors.ink};
  }

  span {
    display: block;
    margin-top: 2px;
    font-size: 10px;
    color: ${colors.faint};
  }
`;

const Slip = styled.div`
  border: 1px solid ${colors.line};
  border-radius: ${radii.md};
  overflow: hidden;
`;

const SlipHead = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 18px;
  background: ${colors.forest};
  color: #f9f6ee;

  strong {
    display: block;
    font-family: ${fonts.display};
    font-size: 18px;
    font-weight: 500;
  }

  span {
    display: block;
    margin-top: 2px;
    font-size: 10.5px;
    opacity: 0.75;
  }

  em {
    font-style: normal;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    opacity: 0.85;
  }
`;

const SlipBody = styled.div`
  padding: 16px 18px;
  background: #fff;
`;

const SlipTable = styled.div`
  margin-top: 12px;
  border-top: 1px solid ${colors.lineSoft};

  div {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding: 7px 0;
    border-bottom: 1px solid ${colors.lineSoft};
    font-size: 11.5px;
    color: ${colors.inkSoft};
  }

  div:last-child {
    border-bottom: 0;
  }

  strong {
    color: ${colors.ink};
    font-variant-numeric: tabular-nums;
  }
`;

const NetBand = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 14px;
  padding: 12px 14px;
  background: ${colors.cream};
  border: 1px solid ${colors.lineSoft};
  border-radius: ${radii.sm};

  span {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    font-weight: 700;
    color: ${colors.muted};
  }

  strong {
    font-family: ${fonts.display};
    font-size: 22px;
    font-weight: 500;
    color: ${colors.ink};
  }
`;

const employeeValidation = Yup.object({
  name: Yup.string().trim().required('Name is required'),
  role: Yup.string().trim().required('Role is required'),
  department: Yup.string().required(),
  email: Yup.string().email('Enter a valid email').required('Email is required'),
});

const leaveValidation = Yup.object({
  employee: Yup.string().required('Select an employee'),
  type: Yup.string().required(),
  dates: Yup.string().trim().required('Add the leave dates'),
  days: Yup.number().positive('Days must be greater than zero').required('Days required'),
  reason: Yup.string().trim().required('Add a reason'),
});

const taskValidation = Yup.object({
  employeeId: Yup.string().required('Select an employee'),
  title: Yup.string().trim().required('Describe the task'),
  due: Yup.string().required('Due date is required'),
});

const salaryValidation = Yup.object({
  employeeId: Yup.string().required('Select an employee'),
  month: Yup.string().required('Month is required'),
  basic: Yup.number().min(0).required('Basic is required'),
  hra: Yup.number().min(0).required('HRA is required'),
  allowances: Yup.number().min(0).required('Allowances are required'),
  deductions: Yup.number().min(0).required('Deductions are required'),
});

const departments = ['Production', 'Quality', 'Design', 'Logistics', 'Sales', 'Finance', 'HR', 'Operations'];
const leaveTypes = ['Casual leave', 'Sick leave', 'Earned leave', 'Work from home', 'Comp off'];
const taskPriorities = ['Urgent', 'High', 'Medium', 'Low'];
const taskStatuses = ['Open', 'In progress', 'Done'];

const monthLabel = (value) => {
  if (!value) return '—';
  const date = new Date(`${value}-01T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
};

const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export default function HrPage() {
  const employees = useDemoStore((state) => state.employees);
  const leaves = useDemoStore((state) => state.leaves);
  const attendance = useDemoStore((state) => state.attendance);
  const employeeTasks = useDemoStore((state) => state.employeeTasks);
  const salaryRecords = useDemoStore((state) => state.salaryRecords);
  const decideLeave = useDemoStore((state) => state.decideLeave);
  const addLeaveRequest = useDemoStore((state) => state.addLeaveRequest);
  const saveEmployee = useDemoStore((state) => state.saveEmployee);
  const deleteEmployee = useDemoStore((state) => state.deleteEmployee);
  const markAttendance = useDemoStore((state) => state.markAttendance);
  const addEmployeeTask = useDemoStore((state) => state.addEmployeeTask);
  const toggleEmployeeTask = useDemoStore((state) => state.toggleEmployeeTask);
  const deleteEmployeeTask = useDemoStore((state) => state.deleteEmployeeTask);
  const addSalaryRecord = useDemoStore((state) => state.addSalaryRecord);
  const processSalary = useDemoStore((state) => state.processSalary);

  const [query, setQuery] = useState('');
  const [department, setDepartment] = useState('All');
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);
  const [salaryOpen, setSalaryOpen] = useState(false);
  const [slipId, setSlipId] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const selected = employees.find((employee) => employee.id === selectedId) || null;
  const editing = employees.find((employee) => employee.id === editingId) || null;
  const slip = salaryRecords.find((record) => record.id === slipId) || null;

  const departmentsList = ['All', ...Array.from(new Set(employees.map((employee) => employee.department)))];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return employees.filter((employee) => {
      if (department !== 'All' && employee.department !== department) return false;
      if (!q) return true;
      return (
        employee.name.toLowerCase().includes(q) ||
        employee.role.toLowerCase().includes(q) ||
        employee.department.toLowerCase().includes(q)
      );
    });
  }, [employees, department, query]);

  const byDepartment = useMemo(() => {
    const map = new Map();
    employees.forEach((employee) => {
      map.set(employee.department, (map.get(employee.department) || 0) + 1);
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [employees]);

  const pendingLeaves = leaves.filter((leave) => leave.status === 'Pending');

  const columns = [
    {
      key: 'name',
      label: 'Employee',
      width: '26%',
      render: (employee) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <Avatar $size="sm">{employee.initials}</Avatar>
          <div>
            <CellPrimary>{employee.name}</CellPrimary>
            <CellSecondary>{employee.id}</CellSecondary>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (employee) => (
        <>
          <CellPrimary style={{ fontWeight: 600 }}>{employee.role}</CellPrimary>
          <CellSecondary>{employee.department}</CellSecondary>
        </>
      ),
    },
    {
      key: 'shift',
      label: 'Shift',
      render: (employee) => <CellSecondary style={{ marginTop: 0 }}>{employee.shift}</CellSecondary>,
    },
    {
      key: 'status',
      label: 'Today',
      render: (employee) => <StatusChip $tone={statusTone(employee.status)}>{employee.status}</StatusChip>,
    },
    {
      key: 'joined',
      label: 'Joined',
      render: (employee) => <CellSecondary style={{ marginTop: 0 }}>{formatDate(employee.joined)}</CellSecondary>,
    },
    {
      key: 'contact',
      label: 'Contact',
      render: (employee) => <CellSecondary style={{ marginTop: 0 }}>{employee.phone}</CellSecondary>,
    },
  ];

  const openCreate = () => {
    setEditingId(null);
    setFormOpen(true);
  };

  const openEdit = (employee) => {
    setEditingId(employee.id);
    setFormOpen(true);
  };

  const employeeInitial = editing
    ? {
        name: editing.name,
        role: editing.role,
        department: editing.department,
        shift: editing.shift,
        status: editing.status,
        joined: editing.joined,
        email: editing.email,
        phone: editing.phone,
      }
    : {
        name: '',
        role: '',
        department: 'Production',
        shift: 'General',
        status: 'Present',
        joined: todayISO(),
        email: '',
        phone: '',
      };

  const employeeTasksFor = (employee) => employeeTasks.filter((task) => task.employeeId === employee.id);
  const salaryFor = (employee) => salaryRecords.filter((record) => record.employeeId === employee.id);

  const printSlip = (record) => {
    const win = window.open('', '_blank', 'width=720,height=900');
    if (!win) {
      notify('Popup blocked', 'Allow popups to print the salary slip.', 'warning');
      return;
    }
    win.document.write(`<!doctype html><html><head><title>${escapeHtml(record.employee)} · ${escapeHtml(monthLabel(record.month))}</title>
      <style>
        body { font-family: -apple-system, 'Segoe UI', sans-serif; color: #10231d; padding: 36px; }
        h1 { font-size: 20px; margin: 0; letter-spacing: 0.04em; }
        .muted { color: #6b7a74; font-size: 11px; }
        .head { display: flex; justify-content: space-between; border-bottom: 2px solid #17493b; padding-bottom: 14px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 24px; margin: 18px 0; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 12px; }
        td { padding: 8px 4px; border-bottom: 1px solid #e7e2d8; }
        td:last-child { text-align: right; font-weight: 600; }
        .net { margin-top: 16px; padding: 12px 14px; background: #fbf8f2; border: 1px solid #e7e2d8; display: flex; justify-content: space-between; font-size: 14px; }
        .net strong { font-size: 18px; }
        .sign { margin-top: 48px; display: flex; justify-content: space-between; font-size: 11px; color: #6b7a74; }
      </style></head><body>
      <div class="head">
        <div><h1>STARK PACKMATE</h1><div class="muted">Enterprise packaging · Mumbai · Pune · Chakan</div></div>
        <div class="muted" style="text-align:right">Salary slip<br/>${escapeHtml(monthLabel(record.month))}</div>
      </div>
      <div class="grid">
        <div><strong>Employee</strong><br/>${escapeHtml(record.employee)}</div>
        <div><strong>Employee ID</strong><br/>${escapeHtml(record.employeeId)}</div>
        <div><strong>Designation</strong><br/>${escapeHtml(record.role)}</div>
        <div><strong>Record</strong><br/>${escapeHtml(record.id)} · ${escapeHtml(record.status)}</div>
      </div>
      <table>
        <tr><td>Basic salary</td><td>${formatINR(record.basic)}</td></tr>
        <tr><td>House rent allowance</td><td>${formatINR(record.hra)}</td></tr>
        <tr><td>Other allowances</td><td>${formatINR(record.allowances)}</td></tr>
        <tr><td>Deductions</td><td>− ${formatINR(record.deductions)}</td></tr>
      </table>
      <div class="net"><span>Net pay</span><strong>${formatINR(record.net)}</strong></div>
      <div class="sign"><span>Employee signature</span><span>Authorised signatory · Stark Packmate</span></div>
      </body></html>`);
    win.document.close();
    win.focus();
    win.print();
  };

  return (
    <div>
      <PageHeaderBar>
        <div>
          <PageHeading>HR &amp; employees</PageHeading>
          <PageDescription>
            Plant and office workforce, shift attendance, leave approvals, tasks and payroll across
            three facilities.
          </PageDescription>
        </div>
        <PageActions>
          <Button
            $variant="light"
            $size="sm"
            onClick={() => {
              downloadCSV(
                'stark-packmate-employees.csv',
                ['ID', 'Name', 'Role', 'Department', 'Shift', 'Status', 'Joined', 'Email', 'Phone'],
                employees.map((employee) => [
                  employee.id,
                  employee.name,
                  employee.role,
                  employee.department,
                  employee.shift,
                  employee.status,
                  employee.joined,
                  employee.email,
                  employee.phone,
                ])
              );
              notify('Directory exported', 'Employee directory downloaded as CSV.', 'success');
            }}
          >
            <Download size={14} /> Export
          </Button>
          <Button $variant="light" $size="sm" onClick={() => setLeaveOpen(true)}>
            <CalendarClock size={14} /> Leave request
          </Button>
          <Button $variant="primary" $size="sm" onClick={openCreate}>
            <Plus size={14} /> Add employee
          </Button>
        </PageActions>
      </PageHeaderBar>

      <MiniStats
        items={[
          { label: 'Present today', value: attendance.present, hint: `of ${attendance.total} employees` },
          { label: 'On leave', value: attendance.onLeave, hint: 'Approved absences' },
          { label: 'Remote', value: attendance.remote, hint: 'Design and sales' },
          { label: 'Overtime hours', value: attendance.overtimeHours, hint: 'This week across shifts' },
        ]}
      />

      <div style={{ height: 18 }} />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: 18 }}>
        <Panel>
          <PanelHeader>
            <div>
              <PanelTitle>Employee directory</PanelTitle>
              <div style={{ marginTop: 4, fontSize: 12, color: colors.muted }}>
                {filtered.length} of {employees.length} employees
              </div>
            </div>
            <Toolbar style={{ padding: 0, border: 0, background: 'transparent' }}>
              <SearchInput value={query} onChange={setQuery} placeholder="Search name, role or department…" />
            </Toolbar>
          </PanelHeader>
          <div style={{ padding: '12px 16px 0' }}>
            <FilterChips
              options={departmentsList.map((name) => ({
                value: name,
                label: name === 'All' ? 'All departments' : name,
                count: name === 'All' ? employees.length : employees.filter((employee) => employee.department === name).length,
              }))}
              value={department}
              onChange={setDepartment}
            />
          </div>
          <PanelBody $flush>
            <DataTable
              columns={columns}
              rows={filtered}
              onRowClick={(employee) => setSelectedId(employee.id)}
              minWidth="880px"
              footer={<span>{filtered.length} employees · select a row for profile, tasks and payroll</span>}
            />
          </PanelBody>
        </Panel>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Panel>
            <PanelHeader>
              <div>
                <PanelTitle>Attendance</PanelTitle>
                <div style={{ marginTop: 4, fontSize: 12, color: colors.muted }}>Today across all plants</div>
              </div>
              <StatusChip $tone="success">
                {Math.round((attendance.present / Math.max(1, attendance.total)) * 100)}%
              </StatusChip>
            </PanelHeader>
            <PanelBody>
              <ProgressTrack style={{ height: 9 }}>
                <ProgressFill $value={(attendance.present / Math.max(1, attendance.total)) * 100} />
              </ProgressTrack>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 10.5, color: colors.muted }}>
                <span>{attendance.present} present</span>
                <span>{attendance.onLeave} leave · {attendance.remote} remote</span>
              </div>
              <Divider style={{ margin: '14px 0' }} />
              {byDepartment.map(([name, count]) => (
                <DeptRow key={name}>
                  <span>{name}</span>
                  <ProgressTrack>
                    <ProgressFill $value={(count / Math.max(...byDepartment.map(([, n]) => n))) * 100} />
                  </ProgressTrack>
                  <em>{count}</em>
                </DeptRow>
              ))}
              <div style={{ marginTop: 12 }}>
                <Button
                  $variant="light"
                  $size="xs"
                  $full
                  onClick={() => notify('Roster shared', 'Updated shift roster emailed to plant heads.', 'success')}
                >
                  <CalendarClock size={13} /> Share roster
                </Button>
              </div>
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader>
              <div>
                <PanelTitle>Task board</PanelTitle>
                <div style={{ marginTop: 4, fontSize: 12, color: colors.muted }}>
                  {employeeTasks.filter((task) => task.status !== 'Done').length} open tasks
                </div>
              </div>
              <ClipboardList size={16} style={{ color: colors.copper }} />
            </PanelHeader>
            <PanelBody>
              {employeeTasks.slice(0, 5).map((task) => (
                <TaskRow key={task.id} $done={task.status === 'Done'}>
                  <div>
                    <strong>{task.title}</strong>
                    <span>
                      {task.employee} · due {formatDate(task.due, { year: undefined })} · {task.priority}
                    </span>
                  </div>
                  <Button
                    $variant={task.status === 'Done' ? 'primary' : 'light'}
                    $size="xs"
                    onClick={() => toggleEmployeeTask(task.id)}
                    aria-label={task.status === 'Done' ? 'Reopen task' : 'Complete task'}
                  >
                    <Check size={12} />
                  </Button>
                </TaskRow>
              ))}
              <div style={{ marginTop: 12 }}>
                <Button
                  $variant="light"
                  $size="xs"
                  $full
                  onClick={() => {
                    setSelectedId(selected?.id || employees[0]?.id || null);
                    setTaskOpen(true);
                  }}
                >
                  <Plus size={13} /> Assign task
                </Button>
              </div>
            </PanelBody>
          </Panel>
        </div>
      </div>

      <div style={{ height: 18 }} />

      <Panel>
        <PanelHeader>
          <div>
            <PanelTitle>Leave requests</PanelTitle>
            <div style={{ marginTop: 4, fontSize: 12, color: colors.muted }}>
              {pendingLeaves.length} awaiting approval
            </div>
          </div>
          <Button $variant="light" $size="xs" onClick={() => setLeaveOpen(true)}>
            <Plus size={13} /> New request
          </Button>
        </PanelHeader>
        <PanelBody>
          {leaves.map((leave) => (
            <div key={leave.id} style={{ padding: '12px 0', borderBottom: `1px solid ${colors.lineSoft}` }}>
              <LeaveTop>
                <Avatar $size="sm">{leave.initials}</Avatar>
                <div>
                  <strong>
                    {leave.employee} · {leave.type}
                  </strong>
                  <span>
                    {leave.dates} · {leave.days} day{leave.days > 1 ? 's' : ''} · {leave.reason}
                  </span>
                </div>
                <StatusChip $tone={statusTone(leave.status)}>{leave.status}</StatusChip>
              </LeaveTop>
              {leave.status === 'Pending' ? (
                <LeaveActions>
                  <Button
                    $variant="primary"
                    $size="xs"
                    onClick={() => {
                      decideLeave(leave.id, 'Approved');
                      notify('Leave approved', `${leave.employee} · ${leave.dates}`, 'success');
                    }}
                  >
                    <Check size={12} /> Approve
                  </Button>
                  <Button
                    $variant="ghost"
                    $size="xs"
                    onClick={() => {
                      decideLeave(leave.id, 'Declined');
                      notify('Leave declined', `${leave.employee} · ${leave.dates}`, 'info');
                    }}
                  >
                    <X size={12} /> Decline
                  </Button>
                </LeaveActions>
              ) : null}
            </div>
          ))}
        </PanelBody>
      </Panel>

      <AppModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? `Edit ${editing.name}` : 'Add employee'}
        description="Employee records drive attendance, tasks and payroll."
        size="md"
      >
        <Formik
          initialValues={employeeInitial}
          validationSchema={employeeValidation}
          enableReinitialize
          onSubmit={(values) => {
            const employee = saveEmployee({
              ...(editing ? { id: editing.id } : {}),
              ...values,
              initials: values.name
                .split(' ')
                .map((part) => part[0])
                .join('')
                .slice(0, 2)
                .toUpperCase(),
            });
            notify(
              editing ? 'Employee updated' : 'Employee added',
              `${employee.name} saved as ${employee.id}.`,
              'success'
            );
            setFormOpen(false);
            setSelectedId(employee.id);
          }}
        >
          <Form>
            <FormGrid $cols={2}>
              <TextField name="name" label="Full name" placeholder="Karan Bhatt" required />
              <TextField name="role" label="Role" placeholder="Dispatch Supervisor" required />
              <SelectField name="department" label="Department" options={departments} />
              <SelectField name="shift" label="Shift" options={['General', 'A', 'B', 'C']} />
              <SelectField name="status" label="Today" options={['Present', 'Remote', 'On leave']} />
              <TextField name="joined" label="Joined" type="date" />
              <TextField name="email" label="Email" type="email" placeholder="name@starkpackmate.com" required />
              <TextField name="phone" label="Phone" placeholder="+91 98…" />
            </FormGrid>
            <FormActions>
              <Button type="button" $variant="secondary" $size="sm" onClick={() => setFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" $variant="primary" $size="sm">
                {editing ? 'Save employee' : 'Add employee'} <ArrowRight size={14} />
              </Button>
            </FormActions>
          </Form>
        </Formik>
      </AppModal>

      <AppModal
        open={leaveOpen}
        onClose={() => setLeaveOpen(false)}
        title="New leave request"
        description="Requests appear in the approval queue with a pending status."
        size="md"
      >
        <Formik
          initialValues={{
            employee: employees[0]?.name || '',
            type: 'Casual leave',
            dates: '',
            days: 1,
            reason: '',
          }}
          validationSchema={leaveValidation}
          enableReinitialize
          onSubmit={(values, helpers) => {
            const employee = employees.find((entry) => entry.name === values.employee);
            const leave = addLeaveRequest({
              ...values,
              days: Number(values.days),
              initials: employee?.initials,
            });
            notify('Leave requested', `${leave.employee} · ${leave.dates} added to approvals.`, 'success');
            setLeaveOpen(false);
            helpers.resetForm();
          }}
        >
          <Form>
            <SelectField
              name="employee"
              label="Employee"
              options={employees.map((employee) => ({ value: employee.name, label: `${employee.name} · ${employee.department}` }))}
            />
            <div style={{ height: 14 }} />
            <FormGrid $cols={2}>
              <SelectField name="type" label="Leave type" options={leaveTypes} />
              <TextField name="days" label="Days" type="number" />
              <TextField name="dates" label="Dates" placeholder="24–26 Nov 2026" />
              <TextField name="reason" label="Reason" placeholder="Family function" />
            </FormGrid>
            <FormActions>
              <Button type="button" $variant="secondary" $size="sm" onClick={() => setLeaveOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" $variant="primary" $size="sm">
                Submit request
              </Button>
            </FormActions>
          </Form>
        </Formik>
      </AppModal>

      <AppModal
        open={taskOpen}
        onClose={() => setTaskOpen(false)}
        title="Assign task"
        description="Tasks appear on the employee profile and the HR task board."
        size="md"
      >
        <Formik
          initialValues={{
            employeeId: selected?.id || employees[0]?.id || '',
            title: '',
            due: todayISO(),
            priority: 'Medium',
            status: 'Open',
          }}
          validationSchema={taskValidation}
          enableReinitialize
          onSubmit={(values, helpers) => {
            const employee = employees.find((entry) => entry.id === values.employeeId);
            const task = addEmployeeTask({
              ...values,
              employee: employee?.name,
            });
            notify('Task assigned', `${task.title} assigned to ${task.employee}.`, 'success');
            setTaskOpen(false);
            helpers.resetForm();
          }}
        >
          <Form>
            <SelectField
              name="employeeId"
              label="Assign to"
              options={employees.map((employee) => ({ value: employee.id, label: `${employee.name} · ${employee.role}` }))}
            />
            <div style={{ height: 14 }} />
            <TextField name="title" label="Task" placeholder="Complete JOB-2439 print run" />
            <div style={{ height: 14 }} />
            <FormGrid $cols={2}>
              <TextField name="due" label="Due date" type="date" />
              <SelectField name="priority" label="Priority" options={taskPriorities} />
              <SelectField name="status" label="Status" options={taskStatuses} />
            </FormGrid>
            <FormActions>
              <Button type="button" $variant="secondary" $size="sm" onClick={() => setTaskOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" $variant="primary" $size="sm">
                Assign task
              </Button>
            </FormActions>
          </Form>
        </Formik>
      </AppModal>

      <AppModal
        open={salaryOpen}
        onClose={() => setSalaryOpen(false)}
        title="Add salary record"
        description="Net pay is calculated from earnings less deductions."
        size="md"
      >
        <Formik
          initialValues={{
            employeeId: selected?.id || employees[0]?.id || '',
            month: todayISO().slice(0, 7),
            basic: '',
            hra: '',
            allowances: '',
            deductions: '',
            status: 'Pending',
          }}
          validationSchema={salaryValidation}
          enableReinitialize
          onSubmit={(values, helpers) => {
            const employee = employees.find((entry) => entry.id === values.employeeId);
            const record = addSalaryRecord({
              ...values,
              employee: employee?.name,
              role: employee?.role,
            });
            notify('Salary record added', `${record.employee} · ${monthLabel(record.month)} · ${formatINR(record.net)} net.`, 'success');
            setSalaryOpen(false);
            helpers.resetForm();
          }}
        >
          {({ values }) => {
            const employee = employees.find((entry) => entry.id === values.employeeId);
            const net =
              (Number(values.basic) || 0) +
              (Number(values.hra) || 0) +
              (Number(values.allowances) || 0) -
              (Number(values.deductions) || 0);
            return (
              <Form>
                <SelectField
                  name="employeeId"
                  label="Employee"
                  options={employees.map((entry) => ({ value: entry.id, label: `${entry.name} · ${entry.role}` }))}
                />
                <div style={{ height: 14 }} />
                <FormGrid $cols={2}>
                  <TextField name="month" label="Month" type="month" />
                  <SelectField name="status" label="Status" options={['Pending', 'Processed']} />
                  <TextField name="basic" label="Basic" type="number" prefix="₹" />
                  <TextField name="hra" label="HRA" type="number" prefix="₹" />
                  <TextField name="allowances" label="Allowances" type="number" prefix="₹" />
                  <TextField name="deductions" label="Deductions" type="number" prefix="₹" />
                </FormGrid>
                <div
                  style={{
                    marginTop: 14,
                    padding: '11px 13px',
                    background: colors.cream,
                    border: `1px solid ${colors.lineSoft}`,
                    borderRadius: radii.sm,
                    fontSize: 11.5,
                    color: colors.muted,
                  }}
                >
                  Net pay for {employee?.name || 'employee'} <strong style={{ color: colors.ink }}>{formatINR(net)}</strong>
                </div>
                <FormActions>
                  <Button type="button" $variant="secondary" $size="sm" onClick={() => setSalaryOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" $variant="primary" $size="sm">
                    Add record
                  </Button>
                </FormActions>
              </Form>
            );
          }}
        </Formik>
      </AppModal>

      <AppModal
        open={Boolean(slip)}
        onClose={() => setSlipId(null)}
        title="Salary slip preview"
        description={slip ? `${slip.employee} · ${monthLabel(slip.month)}` : ''}
        size="md"
        footer={
          slip ? (
            <>
              <Button $variant="secondary" $size="sm" onClick={() => setSlipId(null)}>
                Close
              </Button>
              <Button $variant="primary" $size="sm" onClick={() => printSlip(slip)}>
                <Printer size={14} /> Print slip
              </Button>
            </>
          ) : null
        }
      >
        {slip ? (
          <Slip>
            <SlipHead>
              <div>
                <strong>Stark Packmate</strong>
                <span>Enterprise packaging · Mumbai · Pune · Chakan</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <em>Salary slip</em>
                <span>{monthLabel(slip.month)}</span>
              </div>
            </SlipHead>
            <SlipBody>
              <DetailGrid $cols={2}>
                <DetailItem>
                  <DetailLabel>Employee</DetailLabel>
                  <DetailValue>{slip.employee}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Employee ID</DetailLabel>
                  <DetailValue>{slip.employeeId}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Designation</DetailLabel>
                  <DetailValue>{slip.role}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Status</DetailLabel>
                  <DetailValue>{slip.status}</DetailValue>
                </DetailItem>
              </DetailGrid>
              <SlipTable>
                <div>
                  <span>Basic salary</span>
                  <strong>{formatINR(slip.basic)}</strong>
                </div>
                <div>
                  <span>House rent allowance</span>
                  <strong>{formatINR(slip.hra)}</strong>
                </div>
                <div>
                  <span>Other allowances</span>
                  <strong>{formatINR(slip.allowances)}</strong>
                </div>
                <div>
                  <span>Deductions</span>
                  <strong>− {formatINR(slip.deductions)}</strong>
                </div>
              </SlipTable>
              <NetBand>
                <span>Net pay</span>
                <strong>{formatINR(slip.net)}</strong>
              </NetBand>
            </SlipBody>
          </Slip>
        ) : null}
      </AppModal>

      <Drawer
        open={Boolean(selected)}
        onClose={() => setSelectedId(null)}
        title={selected ? selected.name : ''}
        description={selected ? `${selected.id} · ${selected.department}` : ''}
        width="560px"
        footer={
          selected ? (
            <>
              <Button $variant="secondary" $size="sm" onClick={() => setSelectedId(null)}>
                Close
              </Button>
              <Button $variant="light" $size="sm" onClick={() => openEdit(selected)}>
                <Pencil size={14} /> Edit
              </Button>
              <Button $variant="light" $size="sm" onClick={() => setDeleteOpen(true)}>
                <Trash2 size={14} /> Delete
              </Button>
              <Button
                $variant="primary"
                $size="sm"
                onClick={() => {
                  setSalaryOpen(true);
                }}
              >
                <Wallet size={14} /> Add salary
              </Button>
            </>
          ) : null
        }
      >
        {selected ? (
          <>
            <PersonHead>
              <Avatar $size="lg">{selected.initials}</Avatar>
              <div>
                <strong>{selected.role}</strong>
                <span>
                  {selected.department} · {selected.shift} shift
                </span>
              </div>
              <StatusChip $tone={statusTone(selected.status)} style={{ marginLeft: 'auto' }}>
                {selected.status}
              </StatusChip>
            </PersonHead>

            <DetailGrid>
              <DetailItem>
                <DetailLabel>Employee ID</DetailLabel>
                <DetailValue>{selected.id}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Joined</DetailLabel>
                <DetailValue>{formatDate(selected.joined)}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Department</DetailLabel>
                <DetailValue>{selected.department}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Shift</DetailLabel>
                <DetailValue>{selected.shift}</DetailValue>
              </DetailItem>
            </DetailGrid>

            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginTop: 14 }}>
              {['Present', 'Remote', 'On leave'].map((next) => (
                <Button
                  key={next}
                  $variant={selected.status === next ? 'primary' : 'light'}
                  $size="xs"
                  onClick={() => {
                    if (selected.status !== next) {
                      markAttendance(selected.id, next);
                      notify('Attendance updated', `${selected.name} marked ${next.toLowerCase()} for today.`, 'success');
                    }
                  }}
                >
                  <UserCheck size={12} /> {next}
                </Button>
              ))}
            </div>

            <Divider style={{ margin: '18px 0' }} />
            <Contact href={`mailto:${selected.email}`}>
              <Mail size={13} /> {selected.email}
            </Contact>
            <Contact href={`tel:${selected.phone}`}>
              <Phone size={13} /> {selected.phone}
            </Contact>

            <Divider style={{ margin: '18px 0 12px' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <SectionLabel style={{ marginBottom: 0 }}>
                <ClipboardList size={12} style={{ verticalAlign: -2, marginRight: 5 }} />
                Tasks
              </SectionLabel>
              <Button
                $variant="light"
                $size="xs"
                onClick={() => {
                  setTaskOpen(true);
                }}
              >
                <Plus size={12} /> Assign
              </Button>
            </div>
            <div style={{ marginTop: 4 }}>
              {employeeTasksFor(selected).map((task) => (
                <TaskRow key={task.id} $done={task.status === 'Done'}>
                  <div>
                    <strong>{task.title}</strong>
                    <span>
                      {task.status} · due {formatDate(task.due)} · {task.priority}
                    </span>
                  </div>
                  <Button $variant="ghost" $size="xs" onClick={() => toggleEmployeeTask(task.id)} aria-label="Toggle task">
                    {task.status === 'Done' ? <X size={12} /> : <Check size={12} />}
                  </Button>
                  <Button $variant="ghost" $size="xs" onClick={() => deleteEmployeeTask(task.id)} aria-label="Delete task">
                    <Trash2 size={12} />
                  </Button>
                </TaskRow>
              ))}
              {employeeTasksFor(selected).length === 0 ? (
                <p style={{ fontSize: 11, color: colors.faint, padding: '8px 0' }}>No tasks assigned.</p>
              ) : null}
            </div>

            <Divider style={{ margin: '18px 0 12px' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <SectionLabel style={{ marginBottom: 0 }}>
                <Wallet size={12} style={{ verticalAlign: -2, marginRight: 5 }} />
                Salary records
              </SectionLabel>
              <span style={{ fontSize: 10.5, color: colors.faint }}>
                {salaryFor(selected).length} records
              </span>
            </div>
            <div style={{ marginTop: 4 }}>
              {salaryFor(selected).map((record) => (
                <SalaryRow key={record.id}>
                  <div>
                    <strong>{monthLabel(record.month)}</strong>
                    <span>
                      {formatINR(record.net)} net · {record.status}
                    </span>
                  </div>
                  <Button $variant="ghost" $size="xs" onClick={() => setSlipId(record.id)}>
                    <Eye size={12} /> Slip
                  </Button>
                  {record.status === 'Pending' ? (
                    <Button
                      $variant="light"
                      $size="xs"
                      onClick={() => {
                        processSalary(record.id);
                        notify('Salary processed', `${record.employee} · ${monthLabel(record.month)}.`, 'success');
                      }}
                    >
                      Process
                    </Button>
                  ) : null}
                </SalaryRow>
              ))}
              {salaryFor(selected).length === 0 ? (
                <p style={{ fontSize: 11, color: colors.faint, padding: '8px 0' }}>No salary records yet.</p>
              ) : null}
            </div>
          </>
        ) : null}
      </Drawer>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete employee"
        message={
          selected
            ? `Remove ${selected.name} (${selected.id})? Their tasks and salary records are removed too.`
            : ''
        }
        confirmLabel="Delete employee"
        tone="danger"
        onConfirm={() => {
          if (!selected) return;
          deleteEmployee(selected.id);
          setSelectedId(null);
          setDeleteOpen(false);
          notify('Employee deleted', `${selected.name} removed from the directory.`, 'success');
        }}
      />
    </div>
  );
}
