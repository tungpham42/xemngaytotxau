import React, { useState } from "react";
import {
  Layout,
  DatePicker,
  Button,
  Card,
  Typography,
  Spin,
  Alert,
  Space,
  Tag,
  ConfigProvider,
  theme,
} from "antd";
import {
  CompassOutlined,
  FireOutlined,
  BookOutlined,
  StarOutlined,
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import "dayjs/locale/vi"; // Import locale tiếng Việt cho Dayjs
import viVN from "antd/locale/vi_VN"; // Import locale tiếng Việt cho Ant Design
import "./App.css";

import { fetchNgocHapInfo, AIResponse } from "./services/aiService";

dayjs.locale("vi");

const { Content, Footer } = Layout;
const { Title, Text } = Typography;

const App: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<AIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConsult = async () => {
    if (!selectedDate) return;
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await fetchNgocHapInfo(selectedDate.format("YYYY-MM-DD"));
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: "#d97706", // Vàng hổ phách
          colorBgContainer: "#1e293b",
          // Cập nhật Font Family chính cho toàn bộ Antd
          fontFamily: "'Alegreya', serif",
        },
        components: {
          Typography: {
            fontFamilyCode: "'Philosopher', sans-serif", // Dùng cho Title
          },
          Button: {
            fontWeight: 700,
          },
        },
      }}
    >
      <Layout style={{ background: "transparent", minHeight: "100vh" }}>
        <Content style={{ padding: "40px 20px" }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            {/* Header Section */}
            <div style={{ textAlign: "center", marginBottom: 50 }}>
              <div style={{ position: "relative", display: "inline-block" }}>
                <CompassOutlined
                  style={{ fontSize: 60, color: "#fbbf24", marginBottom: 20 }}
                  spin={loading}
                />
                {/* Hiệu ứng glow sau la bàn */}
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "60px",
                    height: "60px",
                    background: "#fbbf24",
                    filter: "blur(30px)",
                    opacity: 0.3,
                    zIndex: -1,
                  }}
                ></div>
              </div>

              <Title
                level={1}
                style={{ margin: 0, fontSize: "3rem", fontWeight: 700 }}
              >
                Ngọc Hạp Thông Thư
              </Title>
              <Text
                style={{
                  color: "#94a3b8",
                  fontSize: "1.2rem",
                  fontFamily: "'Philosopher', sans-serif",
                }}
              >
                Vấn sự thiên cơ - Luận giải ngày lành tháng tốt
              </Text>
            </div>

            {/* Input Section */}
            <Card className="mystic-card" bordered={false}>
              <Space
                orientation="vertical"
                size="large"
                style={{ width: "100%", textAlign: "center" }}
              >
                <Title level={4} style={{ margin: 0, color: "#fbbf24" }}>
                  <BookOutlined /> Chọn Ngày Khởi Sự
                </Title>

                <Space wrap size="middle" style={{ justifyContent: "center" }}>
                  <DatePicker
                    value={selectedDate}
                    onChange={(d) => setSelectedDate(d)}
                    format="DD/MM/YYYY"
                    size="large"
                    style={{
                      width: 220,
                      borderColor: "#fbbf24",
                      fontFamily: "'Alegreya', serif",
                    }}
                    placeholder="Chọn ngày dương lịch"
                  />
                  <Button
                    type="primary"
                    icon={<FireOutlined />}
                    onClick={handleConsult}
                    loading={loading}
                    disabled={!selectedDate}
                    size="large"
                    className="glow-button"
                  >
                    {loading ? "Đang Luận Giải..." : "Khai Mở Thiên Cơ"}
                  </Button>
                </Space>
              </Space>
            </Card>

            {/* Error Message */}
            {error && (
              <Alert
                title="Thiên cơ bất khả lộ"
                description={error}
                type="error"
                showIcon
                style={{
                  marginTop: 24,
                  background: "rgba(69, 10, 10, 0.8)",
                  borderColor: "#7f1d1d",
                  backdropFilter: "blur(4px)",
                }}
              />
            )}

            {/* Loading State */}
            {loading && !data && (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <Spin size="large" />
                <div
                  style={{
                    marginTop: 20,
                    color: "#fbbf24",
                    fontSize: "1.2rem",
                    fontFamily: "'Philosopher', sans-serif",
                  }}
                >
                  Đang tra cứu tinh tú, vui lòng đợi...
                </div>
              </div>
            )}

            {/* Result Section */}
            {data && (
              <div style={{ marginTop: 40, animation: "fadeIn 1s ease-in" }}>
                <Card
                  className="mystic-card"
                  title={
                    <Space>
                      <StarOutlined /> Lời Giải Từ Bậc Thầy Phong Thủy
                    </Space>
                  }
                  extra={
                    <Tag
                      color="warning"
                      style={{ color: "#fff", border: "none" }}
                    >
                      Model: {data.used_model}
                    </Tag>
                  }
                >
                  <div className="markdown-body">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw]}
                    >
                      {data.result}
                    </ReactMarkdown>
                  </div>

                  <div
                    style={{
                      marginTop: 40,
                      textAlign: "center",
                      borderTop: "1px solid rgba(251,191,36,0.2)",
                      paddingTop: 20,
                    }}
                  >
                    <Text
                      italic
                      style={{ color: "#94a3b8", fontSize: "1.1rem" }}
                    >
                      "Đức năng thắng số. Hãy làm việc thiện để tích phúc đức."
                    </Text>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </Content>

        <Footer
          style={{
            textAlign: "center",
            background: "transparent",
            color: "#64748b",
            fontFamily: "'Philosopher', sans-serif",
          }}
        >
          Bản quyền ©{new Date().getFullYear()} Ngọc Hạp Thông Thư AI
        </Footer>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
