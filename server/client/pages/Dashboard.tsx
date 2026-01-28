
import React, { useState, useEffect, useMemo } from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  RadialBarChart, RadialBar, PolarAngleAxis
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../services/dataService';
import { taskService } from '../services/taskService';
import { getDepartments } from '../services/departmentService';

// Định nghĩa màu sắc hệ thống
const CHART_COLORS = {
  ALERT: '#ef4444',       // Đỏ (Cảnh báo)
  PROGRESS: '#3b82f6',    // Xanh nước biển (Đang thực hiện tốt)
  TODO: '#94a3b8',        // Xám (Chờ thực hiện)
  DONE: '#10b981'         // Xanh lá (Đã hoàn thành)
};

export const Dashboard: React.FC = () => {
  const { selectedPeriod } = useAuth();
  const [data, setData] = useState({
    okrs: [] as any[],
    tasks: [] as any[],
    departments: [] as any[]
  });
  const [isLoading, setIsLoading] = useState(true);
  const [focusDept, setFocusDept] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [okrs, tasks, depts] = await Promise.all([
        dataService.getOKRs(),
        taskService.getTasks(),
        getDepartments()
      ]);
      setData({ okrs, tasks, departments: depts });
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [selectedPeriod]);

  // --- LOGIC XỬ LÝ DỮ LIỆU ---

  const periodOkrs = useMemo(() =>
    data.okrs.filter(o => o.quarter === selectedPeriod.quarter && o.year === selectedPeriod.year),
    [data.okrs, selectedPeriod]
  );

  // LOGIC PHÂN LOẠI CHI TIẾT NHIỆM VỤ
  const taskAnalysis = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const alertTasks: any[] = [];
    const doneTasks: any[] = [];
    const otherTasks: any[] = [];

    data.tasks.forEach(task => {
      // Tính khoảng cách ngày
      let diffDays = 999;
      let alertReason = "";
      if (task.dueDate) {
        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        const diffTime = dueDate.getTime() - today.getTime();
        diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }

      if (task.status === 'DONE') {
        doneTasks.push(task);
        return;
      }

      let isAlert = false;
      if (diffDays <= 3) {
        isAlert = true;
        alertReason = "Chỉ còn < 3 ngày!";
      } else if (task.status === 'TODO' && diffDays <= 12) {
        isAlert = true;
        alertReason = "Chưa làm & còn < 12 ngày";
      } else if (task.status === 'IN_PROGRESS' && diffDays <= 7) {
        isAlert = true;
        alertReason = "Đang làm & còn < 7 ngày";
      }

      if (isAlert) {
        alertTasks.push({ ...task, alertReason, diffDays });
      } else {
        otherTasks.push(task);
      }
    });

    // Sắp xếp các task cảnh báo theo độ khẩn cấp (diffDays tăng dần)
    alertTasks.sort((a, b) => (a.diffDays || 999) - (b.diffDays || 999));

    return { alertTasks, doneTasks, otherTasks };
  }, [data.tasks]);

  const taskChartData = useMemo(() => {
    const { alertTasks, doneTasks, otherTasks } = taskAnalysis;
    const progressCount = otherTasks.filter(t => t.status === 'IN_PROGRESS').length;
    const todoCount = otherTasks.filter(t => t.status === 'TODO').length;

    return [
      { name: 'Cảnh báo khẩn cấp', value: alertTasks.length, color: CHART_COLORS.ALERT },
      { name: 'Đang thực hiện', value: progressCount, color: CHART_COLORS.PROGRESS },
      { name: 'Chờ thực hiện', value: todoCount, color: CHART_COLORS.TODO },
      { name: 'Đã hoàn thành', value: doneTasks.length, color: CHART_COLORS.DONE },
    ].filter(item => item.value > 0);
  }, [taskAnalysis]);

  const deptProgressData = useMemo(() => {
    return data.departments.map(dept => {
      const deptOkrs = periodOkrs.filter(o => o.department === dept.name);
      const avgProgress = deptOkrs.length > 0
        ? Math.round(deptOkrs.reduce((acc, curr) => acc + (curr.progress || 0), 0) / deptOkrs.length)
        : 0;
      return { name: dept.name, progress: avgProgress, count: deptOkrs.length };
    });
  }, [data.departments, periodOkrs]);

  const displayProgress = useMemo(() => {
    if (focusDept) {
      const dept = deptProgressData.find(d => d.name === focusDept);
      return dept ? dept.progress : 0;
    }
    return periodOkrs.length > 0
      ? Math.round(periodOkrs.reduce((acc, curr) => acc + (curr.progress || 0), 0) / periodOkrs.length)
      : 0;
  }, [focusDept, deptProgressData, periodOkrs]);

  const progressChartData = [{ name: 'Tiến độ', value: displayProgress, fill: '#6366f1' }];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* BIỂU ĐỒ CÔNG VIỆC */}
        <div className="lg:col-span-1 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col">
          <h3 className="text-xl font-black text-slate-800 flex items-center mb-6">
            <span className="material-icons mr-2 text-rose-500">notification_important</span>
            Trạng Thái
          </h3>
          <div className="h-[300px] w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {taskChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  formatter={(value) => <span className="text-slate-600 font-bold ml-1 text-xs">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BẢNG CẢNH BÁO NHIỆM VỤ */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col">
          <h3 className="text-xl font-black text-slate-800 flex items-center mb-6">
            <span className="material-icons mr-2 text-amber-500">list_alt</span>
            Danh sách Nhiệm vụ Cần Chú Ý
          </h3>
          <div className="overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
            {taskAnalysis.alertTasks.length > 0 ? (
              <div className="space-y-3">
                {taskAnalysis.alertTasks.map((task, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-rose-50/50 rounded-2xl border border-rose-100 group hover:shadow-md transition-all">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800 truncate group-hover:text-rose-700">{task.title}</p>
                      <div className="flex items-center mt-1 space-x-3 text-xs">
                        <span className="flex items-center text-slate-500 font-bold">
                          <span className="material-icons text-sm mr-1">event</span>
                          {task.dueDate || 'Chưa có hạn'}
                        </span>
                        <span className="flex items-center text-rose-600 font-black uppercase tracking-tighter italic bg-white px-2 py-0.5 rounded shadow-sm">
                          <span className="material-icons text-xs mr-1">warning</span>
                          {task.alertReason}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 flex flex-col items-end">
                      <span className="px-3 py-1 bg-white text-rose-500 rounded-full text-[10px] font-black border border-rose-200">
                        {task.status === 'TODO' ? 'CHƯA LÀM' : 'ĐANG LÀM'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 py-10">
                <span className="material-icons text-5xl mb-2 opacity-20">check_circle</span>
                <p className="font-bold">Tuyệt vời! Không có nhiệm vụ nào bị cảnh báo.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* TIẾN ĐỘ RADIAL CHART */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="w-full flex justify-between items-center mb-4 relative z-10">
            <h3 className="text-xl font-black text-slate-800">
              {focusDept ? focusDept : 'Tiến độ Toàn Công Ty'}
            </h3>
            {focusDept && (
              <button onClick={() => setFocusDept(null)} className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100">
                LÀM MỚI
              </button>
            )}
          </div>
          <div className="relative h-[300px] w-full max-w-[300px] z-10">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart innerRadius="75%" outerRadius="100%" barSize={26} data={progressChartData} startAngle={90} endAngle={450}>
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar background dataKey="value" cornerRadius={13} animationDuration={2000} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-6xl font-black text-slate-900 tracking-tighter">{displayProgress}%</span>
              <span className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-[0.3em]">PROGRESS</span>
            </div>
          </div>
        </div>

        {/* TIẾN ĐỘ PHÒNG BAN */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center">
            <span className="material-icons mr-2 text-indigo-500">groups</span>
            Phòng Ban
          </h3>
          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
            {deptProgressData.map((dept, i) => (
              <div key={i} onClick={() => setFocusDept(dept.name)} className={`p-4 rounded-3xl border transition-all duration-500 cursor-pointer flex items-center justify-between group
                  ${focusDept === dept.name ? 'border-indigo-500 bg-indigo-50/50 shadow-xl' : 'border-slate-50 bg-slate-50 hover:bg-white hover:border-indigo-200'}`}>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-extrabold text-slate-700 uppercase text-xs">{dept.name}</span>
                    <span className="text-[10px] font-black text-indigo-600 bg-white px-2 py-1 rounded-lg shadow-sm">{dept.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 transition-all duration-1000" style={{ width: `${dept.progress}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NHIỆM VỤ ĐÃ HOÀN THÀNH (Dành riêng 1 khu vực) */}
      {taskAnalysis.doneTasks.length > 0 && (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h3 className="text-xl font-black text-emerald-600 mb-6 flex items-center">
            <span className="material-icons mr-2">task_alt</span>
            Nhiệm vụ Đã Hoàn Thành
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {taskAnalysis.doneTasks.slice(0, 6).map((task, i) => (
              <div key={i} className="flex items-center p-4 bg-emerald-50/30 rounded-2xl border border-emerald-100">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
                  <span className="material-icons text-emerald-600 text-sm">check</span>
                </div>
                <p className="font-bold text-slate-700 text-sm truncate">{task.title}</p>
              </div>
            ))}
            {taskAnalysis.doneTasks.length > 6 && (
              <div className="flex items-center justify-center p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs font-bold">
                Và {taskAnalysis.doneTasks.length - 6} nhiệm vụ khác...
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
