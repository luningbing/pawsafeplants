# Normalized 数据字典

适用范围：TikTok Shop US、seller-fulfilled、单店、规划/结算对账 MVP。页面可读取 Seller Center Orders CSV、Finance XLSX，或高级用户准备的 normalized CSV；全部只在浏览器内存处理，不上传、不留存。每行是一条订单行或结算行，由 `record_type` 区分。

| 字段 | 类型/单位 | 必填 | 适用 record_type | 来源 | 缺失处理 |
|---|---|---:|---|---|---|
| `record_type` | enum: `order` / `settlement` | 是 | 两者 | 用户模板/导出映射 | 非法值计入质量错误 |
| `order_id` | text | 是 | 两者 | Seller Center | 无法关联；对账指标 unavailable |
| `order_line_id` | text | 推荐 | order | Orders Report | 保留 order-level 结果 |
| `sku_id` | text | 推荐 | order | Orders Report | 缺失时归入 `Unassigned`；无法通过 `order_id` 关联结算费用时 SKU 利润显示 `Unavailable` |
| `package_id` | text | 可选 | order | Orders Report | 拆包分析 unavailable |
| `order_created_at` | ISO date/time | 推荐 | order | Orders Report | 时间分析 unavailable |
| `settlement_date` | ISO date/time | 推荐 | settlement | Statement/Payments | 仅保留文件顺序 |
| `order_status` | text | 可选 | 两者 | Orders/Settlement | 不推断订单状态 |
| `quantity` | number | 推荐 | 两者 | Orders/Settlement | 数量指标 unavailable |
| `gross_sales` | USD/order line | 订单+结算至少一侧 | 两者 | Orders: `SKU Subtotal Before Discount`; Finance: `Subtotal before discounts` | 正数折前商品金额；销售额 unavailable |
| `seller_funded_discount` | USD/order line | 可选 | 两者 | Orders: `SKU Seller Discount`; Finance: `- Seller discounts` | 正数表示卖家折扣成本；平台折扣不进入此字段 |
| `refund_amount` | USD/order line | 可选 | settlement | Finance: `- Refund subtotal after seller discounts` | 正数表示退款成本，退款回冲可为负；Orders 的订单级退款未验证前不自动映射 |
| `referral_fee` | USD/order line | 结算推荐 | settlement | Finance: `- Referral fee` | 正数表示费用成本，退款回冲可为负；不默认为 0 |
| `shipping_charge_or_reimbursement` | USD/order line | 可选 | settlement | Finance shipping 叶子字段净和 | signed contribution：补贴/买家运费为正，扣费为负；不得 `abs()` |
| `other_adjustment` | USD/order line | 可选 | settlement | Finance 可比残差 | signed contribution；包含未单列费用、税费及调整，正数增加结算、负数减少结算 |
| `creator_commission_actual` | USD/order line | 可选 | settlement/affiliate | Finance: `- Affiliate Commission` | 正数表示实际佣金成本，退款回冲可为负；没有金额时不能由 Creator Handle 推断 |
| `cogs_per_unit` | USD/unit | 可选 | order | 用户输入/成本表 | 净利润 unavailable |
| `outbound_shipping_per_order` | USD/order | 可选 | order | 用户输入/运单 | 贡献利润 unavailable |
| `unrecovered_return_cost_per_returned_order` | USD/returned order | 可选 | order | 用户输入/退货记录 | 退货损失 unavailable |
| `ad_cpa` | USD/attributed order | 可选 | order | 用户输入/广告报表 | 含广告净利润 unavailable |

## 质量规则

- `order_id` 是最小关联键；`order_id + order_line_id` 是推荐订单行键。
- 同一订单允许多个 `package_id`（拆包），但完全重复的 `record_type + order_id + order_line_id + settlement_date` 计为重复键。
- 金额可为负；必须按字段转换规则处理，不得对整列统一 `abs()`。
- `gross_sales` 和 `seller_funded_discount` 使用折前金额减卖家折扣的经营表达；平台折扣不作为卖家成本。
- Finance 源字段中费用通常为负；`referral_fee`、`creator_commission_actual` 转成“正数表示成本”，但退款回冲仍可为负。
- `refund_amount` 使用退款后卖家折扣口径，normalized 正数表示退款成本。
- 百分比字段若来自扩展文件，必须在 0–100；本标准表不直接保存百分比费率。
- PII（买家姓名、电话、地址、邮箱、支付账号、完整 tracking number）不进入结果；导入质量摘要只显示被丢弃的列名。
- 以 `=`, `+`, `-`, `@` 开头的文本在预览/导出时加单引号，防止 CSV 公式注入。
- 缺失字段显示 `Unavailable` 或“需要补充”，不得静默补 0。
- 经营报表按 `order_id` 将 settlement 金额关联/分摊到订单 SKU；无法关联的 settlement 行只进入总览对账，不伪造 SKU 利润。
- 订单与结算是两个不同事实群体：订单覆盖率 = 被结算 `order_id` 命中的唯一订单数 / 订单唯一数；财务覆盖率 = 被订单 `order_id` 命中的结算行数 / 结算行数。两项必须单独展示；`SKU ID` 只做行级校验，不作为硬关联条件。
- 时间窗口也必须分开显示：Orders 使用 `order_created_at`，Finance 使用 `settlement_date`；窗口不重叠时只提示口径差异，不把未桥接行判为缺失。
- 未桥接财务行必须转成可执行提示，建议补导出更早的 Orders 周文件；不得直接标记为系统缺失。
- 报表可用性必须分层：结算对账可用不等于 SKU 利润可用；COGS 未提供时利润保持 `Unavailable`，广告成本未提供时标记广告成本未加载。
- `shipping_charge_or_reimbursement` 保留净贡献方向；报表以 signed shipping 展示，对成本方向不做无证据的绝对值转换。
- CSV 导出仅包含 SKU 聚合字段（`sku_id`、订单数、数量、销售额、估算净额、利润率），不导出买家 PII。

## 真实 Seller Center 输入（实验性）

- Orders CSV：识别已验证的 63 列真实导出；PII 列在映射前丢弃。
- Finance XLSX：读取 `Order details` Sheet；缺 Sheet 或关键列时明确报错，不猜测。
- 多个 Orders CSV 与一个 Finance XLSX 可分别载入并在内存中合并；多个 Orders 文件适合按周拆分，完全重复的订单行会被丢弃；普通用户不需要手工把 XLSX 转成 CSV。
- 当前自动映射仅用 1 份 Orders CSV 和 1 份 Finance XLSX 验证，仍标记 `experimental mapping`。
- 原始文件、PII、逐订单明细不会进入下载；下载仍只包含安全聚合结果。
